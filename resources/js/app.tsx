import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import React from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'PadelCourt';

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: { borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter, sans-serif' },
                        success: { iconTheme: { primary: '#1B4D3E', secondary: '#fff' } },
                        error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
                    }}
                />
            </>
        );
    },
    progress: {
        color: '#F59E0B',
        showSpinner: false,
    },
});
