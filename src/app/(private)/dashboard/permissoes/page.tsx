'use client';

import { useState } from "react";
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import { 
    Trash2, 
    Lock, 
    Unlock, 
    UserPlus, 
    ShieldCheck, 
    User, 
    Mail,
    AlertTriangle,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserPermission {
    id: string;
    email: string;
    role: 'Administrador' | 'Editor' | 'Leitor';
    status: 'active' | 'locked';
}

export default function UserPermissionsPage() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Leitor");
    const [users, setUsers] = useState<UserPermission[]>([
        { id: "1", email: "admin@empresa.com", role: "Administrador", status: "active" },
        { id: "2", email: "editor@empresa.com", role: "Editor", status: "active" },
        { id: "3", email: "visitante@empresa.com", role: "Leitor", status: "locked" },
    ]);

    // Estado para o Modal de Confirmação
    const [userToDelete, setUserToDelete] = useState<UserPermission | null>(null);

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        const newUser: UserPermission = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            role: role as any,
            status: 'active'
        };
        
        setUsers([newUser, ...users]);
        setEmail("");
    };

    const toggleLock = (id: string) => {
        setUsers(users.map(u => 
            u.id === id ? { ...u, status: u.status === 'active' ? 'locked' : 'active' } : u
        ));
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
        }
    };

    return (
        <DashboardContainer>
            <div className="p-6 max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                        Gestão de Usuários e Permissões
                    </h1>
                    <p className="text-gray-500">Convide novos membros e gerencie níveis de acesso.</p>
                </header>

                {/* Formulário de Convite */}
                <form onSubmit={handleAddUser} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end mb-8">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> E-mail do Usuário
                        </label>
                        <input 
                            type="email" 
                            placeholder="exemplo@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Permissão</label>
                        <select 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Administrador">Administrador</option>
                            <option value="Editor">Editor</option>
                            <option value="Leitor">Leitor</option>
                        </select>
                    </div>
                    <button 
                        type="submit"
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" /> Convidar
                    </button>
                </form>

                {/* Tabela de Usuários */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Usuário</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Permissão</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {users.map((user) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`hover:bg-gray-50/50 transition-colors ${user.status === 'locked' ? 'bg-gray-50/80' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${user.status === 'locked' ? 'bg-gray-200' : 'bg-blue-100'}`}>
                                                    <User className={`w-4 h-4 ${user.status === 'locked' ? 'text-gray-500' : 'text-blue-600'}`} />
                                                </div>
                                                <span className={`text-sm font-medium ${user.status === 'locked' ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    {user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                user.role === 'Administrador' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'Editor' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => toggleLock(user.id)}
                                                className={`p-2 rounded-lg transition-all ${
                                                    user.status === 'locked' 
                                                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                                                    : 'text-green-600 hover:bg-green-50'
                                                }`}
                                            >
                                                {user.status === 'locked' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setUserToDelete(user)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Confirmação de Remoção */}
            <AnimatePresence>
                {userToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setUserToDelete(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        
                        {/* Card do Modal */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <button 
                                        onClick={() => setUserToDelete(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Confirmar exclusão
                                </h3>
                                <p className="text-gray-500">
                                    Você tem certeza que deseja remover <span className="font-semibold text-gray-800">{userToDelete.email}</span>? 
                                    Esta ação não poderá ser desfeita.
                                </p>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    Remover Usuário
                                </button>
                                <button
                                    onClick={() => setUserToDelete(null)}
                                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardContainer>
    );
}