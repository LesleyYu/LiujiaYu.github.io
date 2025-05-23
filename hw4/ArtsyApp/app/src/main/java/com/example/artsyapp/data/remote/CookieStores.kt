package com.example.artsyapp.data.remote

import android.content.Context
import com.franmontiel.persistentcookiejar.PersistentCookieJar
import com.franmontiel.persistentcookiejar.cache.SetCookieCache
import com.franmontiel.persistentcookiejar.persistence.SharedPrefsCookiePersistor
import okhttp3.CookieJar
/**
 * Persistent cookie jar backed by DataStore.
 * Keeps login cookies across app restarts.
 */
object CookieStores {

    private lateinit var cookieJar: PersistentCookieJar
    fun jar(context: Context): PersistentCookieJar {
        if (!::cookieJar.isInitialized) {
            val cache = SetCookieCache()
            val persister = SharedPrefsCookiePersistor(context)
            cookieJar = PersistentCookieJar(cache, persister)
        }
        return cookieJar
    }
}