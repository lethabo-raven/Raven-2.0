<script setup>
import Navbar from '@/components/Navbar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
    <header>
        <div>
            <Navbar />
        </div>
    </header>
    <body>
        <div style="margin: 50px;">
            <RouterView/>
        </div>
    </body>
</template>