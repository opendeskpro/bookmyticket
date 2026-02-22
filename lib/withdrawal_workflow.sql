-- 1. Function to Request Withdrawal
-- Checks balance, deducts amount, records transaction, creates withdrawal request
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  p_amount DECIMAL(12, 2),
  p_method TEXT,
  p_bank_details JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_current_balance DECIMAL(12, 2);
  v_withdrawal_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Check if user exists and lock the row for update
  SELECT wallet_balance INTO v_current_balance
  FROM public.profiles
  WHERE id = v_user_id
  FOR UPDATE;

  -- Validation
  IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient wallet balance';
  END IF;

  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid withdrawal amount';
  END IF;

  -- 1. Deduct from Wallet (HOLD)
  UPDATE public.profiles
  SET wallet_balance = wallet_balance - p_amount
  WHERE id = v_user_id;

  -- 2. Create Withdrawal Record
  INSERT INTO public.withdrawals (
    organiser_id,
    amount,
    charge, -- Platform fee logic can be added here, currently 0
    payable, -- Payable is amount - charge
    method,
    status
  ) VALUES (
    v_user_id,
    p_amount,
    0, 
    p_amount,
    p_method,
    'PENDING'
  ) RETURNING id INTO v_withdrawal_id;

  -- 3. Record 'DEBIT' Transaction
  INSERT INTO public.transactions (
    organiser_id,
    type,
    amount,
    method,
    pre_balance,
    after_balance,
    status,
    created_at
  ) VALUES (
    v_user_id,
    'DEBIT',
    p_amount,
    'WITHDRAWAL_REQUEST',
    v_current_balance,
    v_current_balance - p_amount,
    'SUCCESS', -- The debit itself is successful (money moved to hold)
    NOW()
  );

  RETURN jsonb_build_object('success', true, 'withdrawal_id', v_withdrawal_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Function to Approve Withdrawal
-- Updates status to APPROVED
CREATE OR REPLACE FUNCTION public.approve_withdrawal(
  p_withdrawal_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_withdrawal_record RECORD;
BEGIN
  -- Get withdrawal record
  SELECT * INTO v_withdrawal_record
  FROM public.withdrawals
  WHERE id = p_withdrawal_id
  FOR UPDATE;

  IF v_withdrawal_record IS NULL THEN
    RAISE EXCEPTION 'Withdrawal request not found';
  END IF;

  IF v_withdrawal_record.status != 'PENDING' THEN
    RAISE EXCEPTION 'Withdrawal is not pending';
  END IF;

  -- Update Status
  UPDATE public.withdrawals
  SET status = 'APPROVED'
  WHERE id = p_withdrawal_id;

  -- No wallet change needed, money was already deducted on request

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Function to Reject Withdrawal
-- Updates status to REJECTED and REFUNDS the amount
CREATE OR REPLACE FUNCTION public.reject_withdrawal(
  p_withdrawal_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_withdrawal_record RECORD;
  v_current_balance DECIMAL(12, 2);
BEGIN
  -- Get withdrawal record
  SELECT * INTO v_withdrawal_record
  FROM public.withdrawals
  WHERE id = p_withdrawal_id
  FOR UPDATE;

  IF v_withdrawal_record IS NULL THEN
    RAISE EXCEPTION 'Withdrawal request not found';
  END IF;

  IF v_withdrawal_record.status != 'PENDING' THEN
    RAISE EXCEPTION 'Withdrawal is not pending';
  END IF;

  -- 1. Update Status
  UPDATE public.withdrawals
  SET status = 'REJECTED'
  WHERE id = p_withdrawal_id;

  -- 2. Refund to Wallet
  UPDATE public.profiles
  SET wallet_balance = wallet_balance + v_withdrawal_record.amount
  WHERE id = v_withdrawal_record.organiser_id
  RETURNING wallet_balance INTO v_current_balance;

  -- 3. Record 'REFUND' Transaction
  INSERT INTO public.transactions (
    organiser_id,
    type,
    amount,
    method,
    pre_balance,
    after_balance,
    status,
    created_at
  ) VALUES (
    v_withdrawal_record.organiser_id,
    'CREDIT',
    v_withdrawal_record.amount,
    'WITHDRAWAL_REFUND',
    v_current_balance - v_withdrawal_record.amount,
    v_current_balance,
    'SUCCESS',
    NOW()
  );

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
