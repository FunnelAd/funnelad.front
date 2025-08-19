"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Package,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  ShoppingCart,
  Calendar,
  TrendingUp,
  Users,
} from "lucide-react";
import { crmServices } from "@/core/services/crmService";
import { ICustomer } from "@/core/types/crm";

export default function ContactsPage() {
  useEffect(() => {
    loadData();
  }, []);

  const [contacts, setContacts] = useState<ICustomer[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  async function loadData() {
    const data = await crmServices.getCustomersByIdBusiness(
      "685f5b9ad9a068c851b44116"
    );
    setContacts(data);
    console.log(data);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Creado":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "En proceso":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Pendiente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCustomerBehavior = (ordersCount: number, lastOrder: any) => {
    if (ordersCount === 0) return { label: "Nuevo", color: "text-blue-400", icon: "👋" };
    if (ordersCount >= 5) return { label: "Leal", color: "text-green-400", icon: "⭐" };
    if (lastOrder && new Date(lastOrder.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      return { label: "Activo", color: "text-yellow-400", icon: "🔥" };
    }
    return { label: "Regular", color: "text-gray-400", icon: "📊" };
  };

  const getCustomerIcon = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = [
      'from-purple-500 to-purple-600',
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
    ];
    const colorIndex = firstLetter.charCodeAt(0) % colors.length;
    return { letter: firstLetter, gradient: colors[colorIndex] };
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email &&
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchTerm));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "with-orders" && contact.ordersCount > 0) ||
      (statusFilter === "no-orders" && contact.ordersCount === 0);

    return matchesSearch && matchesStatus;
  });

  const handleCreateContact = () => {
    if (newContact.name.trim()) {
      const contact = {
        id: Date.now(),
        name: newContact.name,
        email: newContact.email || null,
        phone: newContact.phone || null,
        ordersCount: 0,
        lastOrder: null,
      };
      setNewContact({ name: "", email: "", phone: "" });
      setShowCreateForm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #00212f 0%, #0a2d3f 100%)',
      color: '#ffffff',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      {/* Header */}
      <div className="sticky top-0 z-50" style={{
        background: 'rgba(20, 103, 137, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(237, 203, 114, 0.2)',
        padding: '20px 0'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold text-[#00212f]" 
                   style={{
                     background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                     animation: 'breathe 3s ease-in-out infinite'
                   }}>
                F
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full" 
                     style={{
                       background: 'linear-gradient(45deg, #edcb72, #edc746)',
                       animation: 'pulse 2s ease-in-out infinite alternate'
                     }}></div>
              </div>
              <div className="text-3xl font-bold" style={{
                background: 'linear-gradient(135deg, #edc746 0%, #edcb72 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                FunnelAd
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-[#00212f] font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                boxShadow: '0 4px 20px rgba(237, 199, 70, 0.3)'
              }}
            >
              <Plus className="h-5 w-5" />
              Nuevo Contacto
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #edcb72 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Contactos
        </h1>
        <p className="text-xl mb-12 max-w-2xl" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Gestiona tu lista de contactos y segmentos con herramientas avanzadas de CRM para mejorar las relaciones con tus clientes.
        </p>

        {/* Filtros y búsqueda */}
        <div className="p-8 mb-8 rounded-3xl" style={{
          background: 'rgba(20, 103, 137, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(237, 203, 114, 0.2)',
          boxShadow: '0 20px 40px rgba(237, 199, 70, 0.1)'
        }}>
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400" />
                <input
                  type="text"
                  placeholder="Buscar contactos..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl focus:ring-2 text-white placeholder-gray-400 transition-all duration-300"
                  style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.3)',
                    focusRingColor: 'rgba(237, 203, 114, 0.5)'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-yellow-400" />
                <select
                  className="px-4 py-4 rounded-xl focus:ring-2 text-white transition-all duration-300"
                  style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.3)',
                    focusRingColor: 'rgba(237, 203, 114, 0.5)'
                  }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="with-orders">Con pedidos</option>
                  <option value="no-orders">Sin pedidos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de contactos */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-20 mx-auto max-w-md rounded-3xl" style={{
            background: 'rgba(20, 103, 137, 0.05)',
            border: '2px dashed rgba(237, 203, 114, 0.3)'
          }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl" style={{
              background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
              color: '#00212f'
            }}>
              👥
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">
              {searchTerm ? "No se encontraron contactos" : "¡Crea tu primer contacto!"}
            </h2>
            <p className="mb-8" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {searchTerm
                ? "No se encontraron contactos con ese criterio de búsqueda"
                : "Los contactos te ayudarán a gestionar mejor las relaciones con tus clientes y mejorar las ventas."}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-3 px-8 py-4 mx-auto rounded-2xl text-[#00212f] font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                boxShadow: '0 4px 20px rgba(237, 199, 70, 0.3)'
              }}
            >
              <Plus className="h-5 w-5" />
              Crear mi primer contacto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredContacts.map((contact) => {
              const behavior = getCustomerBehavior(contact.ordersCount, contact.order);
              const iconData = getCustomerIcon(contact.name);
              
              return (
                <div
                  key={contact._id}
                  className={`relative rounded-3xl p-8 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl overflow-hidden border`}
                  style={{
                    background: contact.ordersCount > 0 
                      ? 'rgba(237, 203, 114, 0.1)' 
                      : 'rgba(20, 103, 137, 0.1)',
                    backdropFilter: 'blur(15px)',
                    borderColor: contact.ordersCount > 0 
                      ? 'rgba(237, 203, 114, 0.3)' 
                      : 'rgba(237, 203, 114, 0.2)',
                    boxShadow: contact.ordersCount > 0 
                      ? '0 0 30px rgba(237, 199, 70, 0.1)' 
                      : 'none'
                  }}
                >
                  {/* Top gradient line */}
                  <div 
                    className="absolute top-0 left-0 right-0"
                    style={{
                      height: '4px',
                      background: 'linear-gradient(90deg, #af8d46 0%, #edc746 100%)',
                    }}
                  ></div>

                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 text-white">
                        {contact.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{behavior.icon}</span>
                        <span className={`font-semibold ${behavior.color}`}>
                          {behavior.label}
                        </span>
                      </div>
                    </div>
                    <div 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        contact.ordersCount > 0
                          ? 'text-green-400 border-green-400/30 bg-green-400/20'
                          : 'text-gray-400 border-gray-400/30 bg-gray-400/20'
                      }`}
                      style={{ border: '1px solid' }}
                    >
                      <div 
                        className={`w-2 h-2 rounded-full ${contact.ordersCount > 0 ? 'bg-green-400' : 'bg-gray-400'}`}
                        style={{ animation: 'pulse 2s ease-in-out infinite' }}
                      ></div>
                      {contact.ordersCount > 0 ? 'Cliente' : 'Lead'}
                    </div>
                  </div>

    

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    {contact.email && (
                      <div className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        <Mail className="h-4 w-4 text-yellow-400" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        <Phone className="h-4 w-4 text-yellow-400" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {!contact.email && !contact.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>Sin información de contacto</span>
                      </div>
                    )}
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 rounded-xl" style={{
                      background: 'rgba(0, 33, 47, 0.5)',
                      border: '1px solid rgba(237, 203, 114, 0.1)'
                    }}>
                      <div className="text-2xl font-bold text-yellow-400 mb-1">
                        {contact.ordersCount}
                      </div>
                      <div className="text-xs uppercase tracking-wider flex items-center justify-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        <ShoppingCart className="h-3 w-3" />
                        Pedidos
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl" style={{
                      background: 'rgba(0, 33, 47, 0.5)',
                      border: '1px solid rgba(237, 203, 114, 0.1)'
                    }}>
                      <div className="text-2xl font-bold text-yellow-400 mb-1">
                        {contact.ordersCount > 0 ? Math.floor(Math.random() * 50) + 20 : 0}%
                      </div>
                      <div className="text-xs uppercase tracking-wider flex items-center justify-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        <TrendingUp className="h-3 w-3" />
                        Engagement
                      </div>
                    </div>
                  </div>

                  {/* Last Order Info */}
                  {contact.order ? (
                    <div className="p-4 rounded-xl mb-6" style={{
                      background: 'rgba(76, 175, 80, 0.1)',
                      border: '1px solid rgba(76, 175, 80, 0.2)'
                    }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white flex items-center gap-2">
                          <Package className="h-4 w-4 text-green-400" />
                          Último Pedido
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.order.status)}`}>
                          {contact.order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        <div className="font-mono text-xs text-yellow-400">#{contact.order._id.slice(-8)}</div>
                        {contact.order.createdAt && (
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(contact.order.createdAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl mb-6" style={{
                      background: 'rgba(158, 158, 158, 0.1)',
                      border: '1px solid rgba(158, 158, 158, 0.2)'
                    }}>
                      <div className="text-center text-gray-400">
                        <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <span className="text-sm">Sin pedidos aún</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="flex-1 p-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #146789 0%, #00212f 100%)',
                        border: '1px solid #146789',
                        color: '#ffffff'
                      }}
                    >
                      Ver Perfil
                    </button>
                    <button
                      className="p-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:text-[#00212f] hover:-translate-y-0.5"
                      style={{
                        background: 'rgba(20, 103, 137, 0.1)',
                        border: '1px solid rgba(237, 203, 114, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(20, 103, 137, 0.1)';
                      }}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para crear contacto */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="max-w-lg w-full mx-4 rounded-3xl p-8" style={{
            background: 'rgba(20, 103, 137, 0.1)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(237, 203, 114, 0.2)',
            boxShadow: '0 20px 40px rgba(237, 199, 70, 0.2)'
          }}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">
                Crear Nuevo Contacto
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-yellow-400 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-4 rounded-xl focus:ring-2 text-white placeholder-gray-400 transition-all duration-300"
                  style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.3)',
                    focusRingColor: 'rgba(237, 203, 114, 0.5)'
                  }}
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="Nombre del contacto"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-yellow-400 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-4 rounded-xl focus:ring-2 text-white placeholder-gray-400 transition-all duration-300"
                  style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.3)',
                    focusRingColor: 'rgba(237, 203, 114, 0.5)'
                  }}
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  placeholder="ejemplo@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-yellow-400 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-4 rounded-xl focus:ring-2 text-white placeholder-gray-400 transition-all duration-300"
                  style={{
                    background: 'rgba(0, 33, 47, 0.5)',
                    border: '1px solid rgba(237, 203, 114, 0.3)',
                    focusRingColor: 'rgba(237, 203, 114, 0.5)'
                  }}
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    border: '1px solid rgba(237, 203, 114, 0.3)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(20, 103, 137, 0.1)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateContact}
                  className="flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 text-[#00212f]"
                  style={{
                    background: 'linear-gradient(135deg, #af8d46 0%, #edc746 100%)',
                    boxShadow: '0 4px 20px rgba(237, 199, 70, 0.3)'
                  }}
                >
                  Crear Contacto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}