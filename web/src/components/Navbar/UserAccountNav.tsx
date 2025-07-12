'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import Image from 'next/image'
import { Icons } from '../ui/Icons'
import Link from 'next/link'
import { logout } from '@/actions/logout'

interface UserAccountNavProps {
  email: string | undefined
  name: string
  imageUrl: string | null
}

const UserAccountNav = ({
  email,
  imageUrl,
  name,
}: UserAccountNavProps) => {

  const logoutOnClick = () => {
    logout()
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='overflow-visible'>
        <Button className='rounded-full h-8 w-8 aspect-square bg-slate-400'>
          <Avatar className='relative w-8 h-8'>
            {imageUrl ? (
              <div className='relative aspect-square h-full w-full cursor-pointer'>
                <Image
                  fill
                  src={imageUrl}
                  alt='profile picture'
                  referrerPolicy='no-referrer'
                />
              </div>
            ) : (
              <AvatarFallback className='cursor-pointer'>
                <span className='sr-only'>{name}</span>
                <Icons.user className='h-4 w-4 text-zinc-900' />
              </AvatarFallback>
            )}
             
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='bg-white' align='end'>
        <Link href="/profile" className="no-underline">
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            {name && (
              <p className='font-medium text-sm text-black'>
                {name}
              </p>
            )}
            {email && (
              <p className='w-[200px] truncate text-xs text-zinc-700'>
                {email}
              </p>
            )}
          </div>
        </div>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem className='cursor-pointer' asChild>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>


        <DropdownMenuSeparator />

        <DropdownMenuItem className='cursor-pointer' asChild>
          <button className='w-full' onClick={logoutOnClick}>Logout</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav