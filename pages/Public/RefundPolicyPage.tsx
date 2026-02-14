
import React, { useEffect } from 'react';

const RefundPolicyPage: React.FC = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-inter pb-24">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <p className="text-slate-400 italic text-sm mb-4">Last updated on January 02, 2026.</p>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 tracking-tight">
          Refunds and Cancellation Policy
        </h1>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
          
          <p>
            Our goal is to make your purchasing experience easy, efficient, and equitable, so we can get you on your way to live events as quickly as possible. The following policy is designed to ensure your satisfaction and understanding of the purchase process on our sites and mobile applications, <a href="https://www.bookmyticket.io" className="text-amber-500 font-bold hover:underline">www.bookmyticket.io</a> (collectively, the “Site”). This Purchase Policy applies to any purchases on our Site made on or after January 1, 2024. Please also review our user agreement which governs your use of our Site, and your purchase, possession, or use of Book My Ticket platform, products, or services. If you have any questions, please <a href="#" className="text-amber-500 font-bold hover:underline">contact us</a>.
          </p>

          <p className="p-6 bg-slate-50 rounded-2xl border-l-4 border-amber-500 text-slate-800">
            Refunds and cancellations will be processed only if an event is canceled or postponed by the event organizer.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">When are refunds applicable?</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>If the event is officially <span className="font-black text-slate-900">canceled</span> by the organizer</li>
              <li>If the event is <span className="font-black text-slate-900">postponed</span>, and attendees are unable to attend on the new date</li>
              <li>If the event organizer has approved refund requests under specific conditions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Processing Time:</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><span className="font-black text-slate-900">Refund Initiation:</span> 3-5 business days after approval</li>
              <li><span className="font-black text-slate-900">Bank Processing Time:</span> Additional 2-3 days (varies by provider)</li>
              <li><span className="font-black text-slate-900">Mode of Refund:</span> The amount will be credited to the original payment method</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Important Notes:</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>Book My Ticket acts as a <span className="font-black text-slate-900">ticketing platform</span> and does not directly approve cancellations or refunds. These decisions are solely made by the <span className="font-black text-slate-900">event organizer</span>.</li>
              <li>Customers requesting refunds must <span className="font-black text-slate-900">reach out to the organizer</span> through the event page on Book My Ticket or initiate a request under <span className="font-black text-slate-900">"My Bookings"</span> in their Book My Ticket account.</li>
              <li>Any additional terms related to refunds will be communicated by the event organizer.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Currency</h2>
            <p>
              All ticket prices for events that occur in India are stated in Indian Currency. All ticket prices for events that occur in International are collected in U.S Dollar.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Payment Methods</h2>
            <p>
              We accept several methods of payment to accommodate your needs, including (among others) American Express, Visa, MasterCard, and, for qualifying events, in Book My Ticket Platforms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Who You Are Buying From</h2>
            <p>
              We act as the agent to those who provide events, such as artists, venues, teams, fan clubs, promoters, and leagues (the “Event Organizer”). We generally sell tickets on behalf of the Event Organizer, though, in some rare instances, we may own a small number of tickets as part of our services contract with the Event Organizer. When you purchase a ticket for an event that is located in the India, Book My Ticket Platform will be handling the transaction and collecting payment for the Event Organizer.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Pricing and Availability</h2>
            <p>
              We sell tickets on behalf of Event Organizers, which means we do not set the ticket prices or determine seating locations. Event Organizers typically set the face price of their tickets. Tickets are generally sold through several distribution points, including websites, apps, and box offices. Most distribution points generally access the same ticketing system and inventory; therefore, tickets for popular events may sell out quickly. Occasionally, additional tickets may be available prior to the event. However, we do not control this inventory or its availability. Check out our FAQs section for more information on ticket availability.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Order Confirmation and Processing</h2>
            <p>
              Your order is confirmed when we send you a confirmation, in the form of a confirmation page or email (“Order Confirmation”).
            </p>
            <p>
              If you do not receive an Order Confirmation after submitting payment information, or if you experience an error message or service interruption after submitting payment information, it is your responsibility to confirm via your account whether or not your order has been placed. Only you may be aware of any problems that may occur during the purchase process. We will not be responsible for losses (monetary or otherwise) if you assume that an order was not placed because you failed to receive confirmation.
            </p>
            <p>
              With respect to resale ticket purchases from <a href="https://www.bookmyticket.io" className="text-amber-500 font-bold hover:underline">www.bookmyticket.io</a>: Immediately after you submit your request for tickets, we will send you an email notifying you that we have received your request. This does not confirm ticket availability or prices. It only indicates that we have received your request for those tickets, and have begun the process of seeking to secure the requested tickets. Once the requested tickets have been secured by us, method of payment used at time of purchase will be charged, and we will send an Order Confirmation confirming that your request has been finalized, and that we have purchased the tickets on your behalf. You should also receive a copy of your invoice. Your order may be finalized even if you do not receive an Order Confirmation, finalized invoice, or updated status email from us. If you have not heard from us, or have only received confirmation that we received your ticket request, please contact us to check on your order. NEVER make an assumption about the status of your order because you have not been contacted by us. Orders cannot be canceled due to problems with receipt of emails.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Service Fees, Order Processing Fees, Taxes, and Shipping Charges</h2>
            <p>
              Tickets purchased on our Site are typically subject to, among other possible fees, a per ticket service fee and a per order processing fee. We collect tax as required by state and local laws. We may display the tax separately or include it in the total service fee amount. Any shipping or delivery charges are calculated based on delivery location and shipping method. Please note that the delivery fee, as well as the order processing fee, may not reflect the actual cost to deliver or process your order, and in some cases, these fees may include a profit to Book My Ticket.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Number of Tickets or “Ticket Limits”</h2>
            <p>
              When purchasing tickets on our Site, you are limited to a specified number of tickets for each event (also known as a “ticket limit”). This ticket limit is posted during the purchase process and verified with every transaction. This policy is in effect to discourage unfair ticket buying practices. Each account must be linked to a unique individual, and must contain valid and verifiable information. Multiple accounts may not be used to circumvent or exceed published ticket limits. If you exceed or attempt to exceed the posted ticket limits, we reserve the right to cancel, without notice, any or all orders and tickets, in addition to prohibiting your ticket purchasing abilities. Any tickets canceled due to violating the posted ticket limit may be refunded at face value (excluding fees). This includes orders associated with the same name, e-mail address, billing address, credit/ debit card number, or other information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Ticket Transfer</h2>
            <p>
              Ticket Transfer is a safe and easy way to transfer (send) tickets digitally to another person. If your tickets are eligible for transfer, you can send them to friends or family members from your online account. If you are a Ticket Transfer recipient, meaning someone you know and trust is transferring their tickets to you, you will be able to accept them in your online account. More information can be found in our Ticket Transfer FAQ.
            </p>
            <p>
              Once a recipient accepts a Ticket Transfer, a new barcode is issued and the sender's tickets are invalid. If a ticket has been transferred multiple times, only the ticket from the last transfer will be valid for event entry. All previous ticket barcodes will be invalidated.
            </p>
            <p>
              The sender can modify or cancel a Ticket Transfer before the recipient accepts the transfer, not after. Please note that we may cancel transferred tickets, at any time, if we determine that they were obtained fraudulently or otherwise in violation of our policies; therefore, it is important that you know and trust the individual transferring tickets to you before accepting them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Opening Acts / Festival Acts</h2>
            <p>
              Opening acts, guests, or undercards (each an “Opening Act”) may sometimes tour with headlining performers. We are not always made aware of Opening Acts or the length of their performances. Opening Acts, as well as festival performers, are subject to change or cancellation at any time without notice. No refund will be owed if an Opening Act or festival performer is changed or canceled.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Canceled, Postponed, Rescheduled, and Moved Events</h2>
            <p>
              Occasionally, events are canceled, postponed, rescheduled to a different date or materially different time, or moved to a different venue:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>If the event is canceled: no action is required to obtain a refund; we will issue a refund to the original method of payment used at time of purchase, once funds are received from the Event Organizer.</li>
              <li>If the event is postponed, rescheduled, or moved: your ticket(s) are still valid, and no further action is required.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Limitation of Liability</h2>
            <p>
              You voluntarily assume all risks and danger incidental to the event for which the ticket is issued, whether occurring before, during or after the event, and you waive any claims for personal injury or death against us.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">You Are Subject to Search</h2>
            <p>
              You and your belongings may be searched on entry to the event. You consent to such searches and waive any related claims that may arise. If you elect not to consent to such searches, you may be denied entry to the event without refund or other compensation.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
