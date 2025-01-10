import { createRouter, createWebHistory } from 'vue-router'

import SignIn from "../modules/firebase/SignIn.vue";
import Register from "../modules/firebase/Register.vue";
import Feed from "../modules/firebase/Feed.vue";
import {getAuth, onAuthStateChanged, getIdToken} from "firebase/auth";
import Home from "../modules/firebase/Home.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/sign-in',
        name: 'signIn',
        component: SignIn
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/feed',
        name: 'feed',
        component: Feed,
        meta: {
            requiresAuth: true
        }
    }

]


const router = createRouter({
    history: createWebHistory(),
    routes
})

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            async (user) => {
                if (user) {
                    const idToken = await getIdToken(user);
                    localStorage.setItem('token', idToken)
                }
                removeListener()
                resolve(user)
        },
            reject
        )
    })
}
router.beforeEach(async (to, from, next) => {
    if(to.matched.some((record) => record.meta.requiresAuth)){
        if(await getCurrentUser()){
            next()
        } else {
            alert("You don't have access !")
            next("/about")
        }
    }else {
        next()
    }
})

export default router