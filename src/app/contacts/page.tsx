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

  const getStatusColor = (status: any) => {
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
      // setContacts([...contacts, contact]);
      setNewContact({ name: "", email: "", phone: "" });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
            Contactos
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Gestiona tu lista de contactos y segmentos con herramientas
            avanzadas de CRM
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-yellow-500/20 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-500" />
                <input
                  type="text"
                  placeholder="Buscar contactos..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 text-white placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-yellow-500" />
                <select
                  className="bg-slate-700/50 border border-yellow-500/30 rounded-xl px-4 py-4 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="with-orders">Con pedidos</option>
                  <option value="no-orders">Sin pedidos</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-yellow-500/25 hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Nuevo Contacto
            </button>
          </div>
        </div>

        {/* Tabla de contactos */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-700/50 border-b border-yellow-500/20">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-yellow-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-yellow-500 uppercase tracking-wider">
                    Información
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-yellow-500 uppercase tracking-wider">
                    Pedidos
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-yellow-500 uppercase tracking-wider">
                    Último pedido
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-yellow-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-slate-700/30 transition-colors duration-200"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center">
                            <User className="h-6 w-6 text-slate-900" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-semibold text-white">
                            {contact.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {contact.email && (
                          <div className="flex items-center mb-2">
                            <Mail className="h-4 w-4 text-yellow-500 mr-2" />
                            {contact.email}
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-yellow-500 mr-2" />
                            {contact.phone}
                          </div>
                        )}
                        {!contact.email && !contact.phone && (
                          <span className="text-gray-500">Sin información</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        <span className="font-semibold text-white text-lg">
                          {contact.ordersCount}
                        </span>{" "}
                        pedidos
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {contact.order ? (
                        <div className="text-sm">
                          <div className="text-white font-semibold mb-1">
                            {contact.order._id}
                          </div>
                          {/* <div className="text-gray-400 mb-2">
                            {contact.order.createdAt}
                          </div> */}
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                              contact.order.status
                            )}`}
                          >
                            {contact.order.status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Sin pedidos
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                      {/* <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-yellow-500 hover:text-yellow-400 p-2 rounded-lg hover:bg-yellow-500/10 transition-all duration-200"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-all duration-200">
                          <Edit className="h-5 w-5" />
                        </button>
                      </div> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-slate-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No hay contactos
              </h3>
              <p className="text-gray-400 text-lg">
                {searchTerm
                  ? "No se encontraron contactos con ese criterio"
                  : "Comienza creando tu primer contacto"}
              </p>
            </div>
          )}
        </div>

        {/* Modal para crear contacto */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800/90 backdrop-blur-md border border-yellow-500/20 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
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
                  <label className="block text-sm font-semibold text-yellow-500 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-slate-700/50 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 text-white placeholder-gray-400"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    placeholder="Nombre del contacto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-yellow-500 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-4 bg-slate-700/50 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 text-white placeholder-gray-400"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    placeholder="ejemplo@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-yellow-500 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-4 bg-slate-700/50 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 text-white placeholder-gray-400"
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
                    className="flex-1 px-6 py-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateContact}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 font-semibold shadow-lg"
                  >
                    Crear Contacto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
