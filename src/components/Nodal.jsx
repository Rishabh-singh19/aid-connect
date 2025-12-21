import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Nodal(){
    const [schemes, setSchemes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingScheme, setEditingScheme] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '', desc: '', startDate: '', endDate: '', feeDate: '',
        correctionWindow: '', category: '', priority: 'Medium', status: 'active'
    });

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/schemes');
            const data = await response.json();
            setSchemes(data);
        } catch (error) {
            console.error('Error fetching schemes:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingScheme 
                ? `http://localhost:5000/api/schemes/${editingScheme.id}`
                : 'http://localhost:5000/api/schemes';
            
            const response = await fetch(url, {
                method: editingScheme ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                fetchSchemes();
                resetForm();
                alert(editingScheme ? 'Scheme updated!' : 'Scheme created!');
            }
        } catch (error) {
            console.error('Error saving scheme:', error);
        }
    };

    const handleEdit = (scheme) => {
        setEditingScheme(scheme);
        setFormData({
            title: scheme.title, desc: scheme.desc, startDate: scheme.startDate,
            endDate: scheme.endDate, feeDate: scheme.feeDate, correctionWindow: scheme.correctionWindow,
            category: scheme.category, priority: scheme.priority, status: scheme.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this scheme?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/schemes/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchSchemes();
                    alert('Scheme deleted!');
                }
            } catch (error) {
                console.error('Error deleting scheme:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '', desc: '', startDate: '', endDate: '', feeDate: '',
            correctionWindow: '', category: '', priority: 'Medium', status: 'active'
        });
        setEditingScheme(null);
        setShowForm(false);
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Nodal Officer Portal</h1>
                            <p className="text-gray-600 text-sm">Manage Government Schemes</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            + New Scheme
                        </button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6 py-8">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Schemes</p>
                                <p className="text-2xl font-semibold text-gray-900">{schemes.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Schemes</p>
                                <p className="text-2xl font-semibold text-gray-900">{schemes.filter(s => s.status === 'active').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-2xl font-semibold text-gray-900">{schemes.filter(s => s.status === 'upcoming').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Closed</p>
                                <p className="text-2xl font-semibold text-gray-900">{schemes.filter(s => s.status === 'closed').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                                {editingScheme ? 'Edit Scheme' : 'Create New Scheme'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Title" value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="p-2 border rounded" required />
                                    <input type="text" placeholder="Category" value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="p-2 border rounded" required />
                                </div>
                                <textarea placeholder="Description" value={formData.desc}
                                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                                    className="w-full p-2 border rounded h-24" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Start Date</label>
                                        <input type="date" value={formData.startDate}
                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                            className="w-full p-2 border rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">End Date</label>
                                        <input type="date" value={formData.endDate}
                                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                            className="w-full p-2 border rounded" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Fee Details" value={formData.feeDate}
                                        onChange={(e) => setFormData({...formData, feeDate: e.target.value})}
                                        className="p-2 border rounded" required />
                                    <input type="text" placeholder="Correction Window" value={formData.correctionWindow}
                                        onChange={(e) => setFormData({...formData, correctionWindow: e.target.value})}
                                        className="p-2 border rounded" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="p-2 border rounded">
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <select value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="p-2 border rounded">
                                        <option value="active">Active</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                        {editingScheme ? 'Update' : 'Create'}
                                    </button>
                                    <button type="button" onClick={resetForm}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">All Schemes ({schemes.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase())).length})</h2>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search schemes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheme</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {schemes.filter(scheme => 
                                    scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    scheme.category.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((scheme) => (
                                    <tr key={scheme.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{scheme.title}</div>
                                                <div className="text-sm text-gray-500">{scheme.desc.substring(0, 60)}...</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{scheme.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                scheme.status === 'active' ? 'bg-green-100 text-green-800' :
                                                scheme.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {scheme.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                scheme.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                scheme.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {scheme.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{scheme.endDate}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(scheme)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 hover:shadow-md transform hover:scale-105 transition-all duration-200">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(scheme.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 hover:shadow-md transform hover:scale-105 transition-all duration-200">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}