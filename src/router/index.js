import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Grid from '@/components/Grid.vue';
import Invoice from '@/components/Invoice.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/grid',
            name: 'grid',
            component: Grid
        },
        {
            path: '/invoice',
            name: 'invoice',
            component: Invoice
        }
    ]
});

export default router;