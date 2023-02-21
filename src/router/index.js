import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        name: "home",
        path: '/',
        component: () => import('@/views/Home.vue'),
        meta: {
            navTitle: "MMRR MOVING OUT",
            showScanButton: true
        }
    },
    {
        path: '/boxes/edit/:code',
        name: "editBox",
        component: () => import('@/views/Box.vue'),
        meta: {
            navTitle: "EDIT BOX",
            showScanButton: false
        }
    },
    {
        path: '/boxes/view/:code',
        name: "viewBox",
        component: () => import("@/views/Box.vue"),
        meta: {
            navTitle: "VIEW BOX",
            showScanButton: true
        }
    },
    {
        path: '/articles/edit/:code',
        name: "editArticle",
        component: () => import("@/views/Article.vue"),
        meta: {
            navTitle: "EDIT ARTICLE",
            showScanButton: false
        }
    },
    {
        path: '/articles/view/:code',
        name: "viewArticle",
        component: () => import("@/views/Article.vue"),
        meta: {
            navTitle: "VIEW ARTICLE",
            showScanButton: true
        }
    },
    {
        path: '/boxes',
        name: "boxes",
        component: () => import("@/views/Boxes.vue"),
        meta: {
            navTitle: "ALL BOXES",
            showScanButton: false
        }
    },
    {
        path: '/articles',
        name: "articles",
        component: () => import("@/views/Articles.vue"),
        meta: {
            navTitle: "ALL ARTICLES",
            showScanButton: false
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from) => {
    router.store.commit("setPreviousRoute", from)
})

router.afterEach((to, from, failure) => {
    if (failure) {
        return
    }
    router.store.commit("setCurrentRouteTitle", to.meta.navTitle)
    router.store.commit("showScanButton", to.meta.showScanButton)
})

export default router