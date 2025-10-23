"use client";

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { BookOpen, FileText, Home, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "@/services/auth";

export  default function NavBar() {
    const [userName, setUserName] = useState("");

    // Pegar o nome de usuário
    useEffect(() => {
        const username = localStorage.getItem('username');

        if (username) {
          setUserName(username)
        }

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
              <span className="ml-3 text-xl font-semibold text-gray-900">EscolaApp</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href='/estudante'>
                <button className="flex items-center cursor-pointer px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                  <Home className="w-4 h-4 mr-2" />
                  Início
                </button>
              </Link>
              <Link href='/relatorios'>
                <button className="flex items-center cursor-pointer px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Atividades
                </button>
              </Link>
              <Link href='/relatorios'>
                <button className="flex items-center cursor-pointer px-4 py-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-md transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Relatórios
                </button>
              </Link>
            </nav>

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
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">zoey@example.com</p>
                  </DropdownItem>
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem key="analytics">Analytics</DropdownItem>
                  <DropdownItem key="system">System</DropdownItem>
                  <DropdownItem key="configurations">Configurations</DropdownItem>
                  <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                  <DropdownItem onClick={logout} key="logout" className="text-red-700">
                    Log Out
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