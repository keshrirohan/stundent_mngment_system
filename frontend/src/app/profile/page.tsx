"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: "user" | "admin";
  image?: string;
  createdAt: string;
  productList: string[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  //   const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    // if (!user) {
    //   router.push("/login");
    // }
    const handleFetchUser = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/me`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const userData = await response.json();

      console.log("Fetched user data:", userData);
      setUser(userData);
    };

    handleFetchUser();
  }, []);

  return (
    // <div className="min-h-screen bg-slate-50 py-8 px-4">
    //   <div className="mx-auto max-w-6xl">
    //     {/* Profile Card */}
    //     <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
    //       {/* Cover */}
    //       <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 md:h-56" />

    //       {/* Profile Section */}
    //       <div className="relative px-6 pb-8">
    //         {/* Avatar */}
    //         <div className="-mt-16 flex flex-col items-center md:flex-row md:items-end md:justify-between">
    //           <div className="flex flex-col items-center md:flex-row md:gap-6">
    //             <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg">
    //               {user.image ? (
    //                 <Image
    //                   src={user.image}
    //                   alt={user.name}
    //                   width={128}
    //                   height={128}
    //                   className="h-full w-full object-cover"
    //                 />
    //               ) : (
    //                 <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-gray-600">
    //                   {user.name.charAt(0).toUpperCase()}
    //                 </div>
    //               )}
    //             </div>

    //             <div className="mt-4 text-center md:mt-0 md:text-left">
    //               <h1 className="text-3xl font-bold text-gray-900">
    //                 {user.name}
    //               </h1>

    //               <p className="mt-1 text-gray-500">{user.email}</p>

    //               <span
    //                 className={`mt-3 inline-flex rounded-full px-4 py-1 text-sm font-semibold ${
    //                   user.role === "admin"
    //                     ? "bg-red-100 text-red-600"
    //                     : "bg-green-100 text-green-600"
    //                 }`}
    //               >
    //                 {user.role}
    //               </span>
    //             </div>
    //           </div>

    //           <button className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 md:mt-0">
    //             Edit Profile
    //           </button>
    //         </div>

    //         {/* Stats */}
    //         <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    //           <div className="rounded-2xl border p-6">
    //             <p className="text-sm text-gray-500">Account Type</p>
    //             <h3 className="mt-2 text-xl font-bold capitalize">
    //               {user.role}
    //             </h3>
    //           </div>

    //           <div className="rounded-2xl border p-6">
    //             <p className="text-sm text-gray-500">Products Listed</p>
    //             <h3 className="mt-2 text-xl font-bold">
    //               {user.productList?.length || 0}
    //             </h3>
    //           </div>

    //           <div className="rounded-2xl border p-6">
    //             <p className="text-sm text-gray-500">Member Since</p>
    //             <h3 className="mt-2 text-xl font-bold">
    //               {new Date(user.createdAt).toLocaleDateString()}
    //             </h3>
    //           </div>
    //         </div>

    //         {/* User Information */}
    //         <div className="mt-10 rounded-2xl border p-6">
    //           <h2 className="mb-6 text-xl font-bold text-gray-900">
    //             Personal Information
    //           </h2>

    //           <div className="grid gap-6 md:grid-cols-2">
    //             <div>
    //               <p className="text-sm text-gray-500">Full Name</p>
    //               <p className="mt-1 font-medium">{user.name}</p>
    //             </div>

    //             <div>
    //               <p className="text-sm text-gray-500">Email Address</p>
    //               <p className="mt-1 font-medium">{user.email}</p>
    //             </div>

    //             <div>
    //               <p className="text-sm text-gray-500">Role</p>
    //               <p className="mt-1 font-medium capitalize">{user.role}</p>
    //             </div>

    //             <div>
    //               <p className="text-sm text-gray-500">Joined On</p>
    //               <p className="mt-1 font-medium">
    //                 {new Date(user.createdAt).toLocaleDateString()}
    //               </p>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Actions */}
    //         <div className="mt-10 flex flex-col gap-4 sm:flex-row">
    //           <button className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800">
    //             Edit Profile
    //           </button>

    //           <button className="rounded-xl border border-red-500 px-6 py-3 font-medium text-red-500 transition hover:bg-red-50">
    //             Logout
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          User Profile
        </h1>
      </div>
    </div>
  );
}
