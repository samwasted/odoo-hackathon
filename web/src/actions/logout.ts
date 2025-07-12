"use server"

import { signOut } from "../../auth"

export const logout = async () => {

    //do any server side actions I want before
    // signing out the user


    await signOut({redirectTo: "/auth/login"})
}
