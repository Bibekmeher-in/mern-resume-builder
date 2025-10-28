import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutTemplate } from 'lucide-react';
import { ProfileInfoCard } from './Cards.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const Navbar = () => {
    return (
        <div className='h-16 bg-white/70 backdrop-blur-xl border-b border-violet-100/50 py-2.5 px-4 md:px-0 sticky top-0 z-50'>
            <div className='max-w-6xl mx-auto h-full flex items-center justify-between gap-5'>

                {/* LOGO SECTION - Simplified structure for better vertical alignment */}
                <Link to='/' className='flex items-center gap-2'>
                    <div className='w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200'>
                        <LayoutTemplate className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent'>
                        ResumePath
                    </span>
                </Link>

                {/* LANGUAGE SWITCHER AND PROFILE CARD */}
                <div className='flex items-center gap-6'>

                    {/* Language Switcher */}
                    <div className='hidden md:flex'>
                        <LanguageSwitcher />
                    </div>

                    {/* Profile Info Card */}
                    <ProfileInfoCard />
                </div>
            </div>
        </div>
    );
};

export default Navbar;