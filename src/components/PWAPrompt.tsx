import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export default function PWAPrompt() {
    const [needRefresh, setNeedRefresh] = useState(false)
    const [offlineReady, setOfflineReady] = useState(false)

    useEffect(() => {
        registerSW({
            onNeedRefresh() {
                setNeedRefresh(true)
            },
            onOfflineReady() {
                setOfflineReady(true)

                // auto-hide setelah 5 detik
                setTimeout(() => setOfflineReady(false), 5000)
            },
        })
    }, [])

    const refreshPage = () => {
        setNeedRefresh(false)
        window.location.reload()
    }

    const closeBanner = () => {
        setNeedRefresh(false)
        setOfflineReady(false)
    }

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
            <AnimatePresence>
                {needRefresh && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-lg"
                    >
                        <span>🔄 Versi baru tersedia!</span>
                        <button
                        onClick={refreshPage}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-xl text-sm font-medium"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={closeBanner}
                            className="ml-2 leading-none text-lg text-gray-400 hover:text-white"
                        >
                            ❌
                        </button>
                    </motion.div>
                )}

                {offlineReady && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 px-4 py-2 rounded-2xl shadow-lg text-white bg-green-600"
                    >
                        <span>✅ App siap offline</span>
                        <button
                            onClick={closeBanner}
                            className="ml-2 leading-none text-lg text-gray-400 hover:text-white"
                        >
                            ❌
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}