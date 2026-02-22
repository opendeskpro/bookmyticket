
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Movie } from '../../../types';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';

const ManageMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Movie>>({
        title: '',
        description: '',
        duration_minutes: 120,
        language: ['English'],
        genre: ['Action'],
        release_date: new Date().toISOString().split('T')[0],
        poster_url: '',
        is_active: true
    });

    const fetchMovies = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error('Failed to fetch movies');
        } else {
            setMovies(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMovie) {
                const { error } = await supabase
                    .from('movies')
                    .update(formData)
                    .eq('id', editingMovie.id);
                if (error) throw error;
                toast.success('Movie updated successfully');
            } else {
                const { error } = await supabase
                    .from('movies')
                    .insert([formData]);
                if (error) throw error;
                toast.success('Movie created successfully');
            }
            setIsModalOpen(false);
            setEditingMovie(null);
            setFormData({
                title: '',
                description: '',
                duration_minutes: 120,
                language: ['English'],
                genre: ['Action'],
                release_date: new Date().toISOString().split('T')[0],
                poster_url: '',
                is_active: true
            });
            fetchMovies();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) return;

        const { error } = await supabase.from('movies').delete().eq('id', id);
        if (error) {
            toast.error('Failed to delete movie');
        } else {
            toast.success('Movie deleted');
            fetchMovies();
        }
    };

    const openEditModal = (movie: Movie) => {
        setEditingMovie(movie);
        setFormData(movie);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Movies</h1>
                    <p className="text-gray-500">Add, edit, or remove movies from the platform</p>
                </div>
                <button
                    onClick={() => {
                        setEditingMovie(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} /> Add Movie
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map((movie) => (
                        <div key={movie.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
                                {movie.poster_url ? (
                                    <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            const newStatus = !movie.is_active;
                                            const { error } = await supabase.from('movies').update({ is_active: newStatus }).eq('id', movie.id);
                                            if (!error) {
                                                toast.success(`Movie ${newStatus ? 'activated' : 'deactivated'}`);
                                                fetchMovies();
                                            } else {
                                                toast.error('Failed to update status');
                                            }
                                        }}
                                        className={`px-2 py-1 rounded text-xs font-bold shadow-sm transition-colors ${movie.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                    >
                                        {movie.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{movie.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                    <div className="flex items-center gap-1"><Clock size={14} /> {movie.duration_minutes}m</div>
                                    <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(movie.release_date).getFullYear()}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(movie)}
                                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(movie.id)}
                                        className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal - Simplified for brevity */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6">{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.duration_minutes}
                                        onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.release_date ? new Date(formData.release_date).toISOString().split('T')[0] : ''}
                                        onChange={e => setFormData({ ...formData, release_date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                                <input
                                    type="url"
                                    value={formData.poster_url || ''}
                                    onChange={e => setFormData({ ...formData, poster_url: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                                >
                                    {editingMovie ? 'Update Movie' : 'Create Movie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMovies;
