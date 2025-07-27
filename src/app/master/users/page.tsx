"use client";

import React from "react";
import { useModal } from "@/core/hooks/useModal";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    avatarUrl: "https://i.pravatar.cc/150?u=alice",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Editor",
    avatarUrl: "https://i.pravatar.cc/150?u=bob",
  },
];

function UserDetailsModal({ user }: { user: User }) {
  return (
    <div className="p-4 relative">
      {/* Botones en la esquina superior derecha */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button className="text-blue-600 hover:underline text-sm">
          Editar
        </button>
        <button className="text-red-600 hover:underline text-sm">
          Eliminar
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 mt-6">
        <img
          src={user.avatarUrl || "https://via.placeholder.com/150"}
          alt={user.name}
          className="w-24 h-24 rounded-full border shadow"
        />
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500">{user.role}</p>
        {/* Agrega aquí más detalles si deseas */}
      </div>
    </div>
  );
}

export default function UserManager() {
  const { showModal } = useModal();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Control de Usuarios</h2>

      <div className="space-y-4">
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => showModal(<UserDetailsModal user={user} />)}
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
