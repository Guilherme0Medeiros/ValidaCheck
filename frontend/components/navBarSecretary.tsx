"use client";

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { BookOpen, FileText, Home, User } from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "@/services/auth";

export  default function NavBarSecretary() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('')


    // Pegar o nome de usuário
    useEffect(() => {
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email')

        if (username) setUserName(username)
        if (email) setEmail(email)

    }, [])


    return (
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Valida Check</span>
            </div>

            

            {/* User Profile */}
            <div className="flex items-center space-x-3">

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar 
                    isBordered
                    color="primary" 
                    showFallback 
                    name={userName} 
                    className="w-8 h-8 bg-gray-300 border-3 border-blue-600 text-blue-600 font-bold" 
                  />
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Profile Actions" 
                  variant="flat"
                  className="bg-white border-2 p-3 rounded-lg"
                >
                  <DropdownItem key="profile" className="h-14 gap-2 ">
                    <p className="font-semibold text-blue-500">Conectado</p>
                    <p className="font-semibold text-gray-400">{email || '-'}</p>
                  </DropdownItem>
                 
                  <DropdownItem onClick={logout} key="logout" className="text-red-700">
                    Sair
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              
              
              <span className="text-gray-900 font-medium">{userName}</span>
              
            </div>
          </div>
        </div>
      </header>
    )
}