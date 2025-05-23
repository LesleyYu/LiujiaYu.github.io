package com.example.artsyapp.data.repository

import android.content.Context
import com.example.artsyapp.data.model.AuthResponse
import com.example.artsyapp.data.model.LoginBody
import com.example.artsyapp.data.model.RegisterBody
import com.example.artsyapp.data.model.UserDto
import com.example.artsyapp.data.remote.ApiService
import com.example.artsyapp.data.remote.CookieStores
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val api: ApiService,
    @ApplicationContext private val context: Context
) : AuthRepository {

    private val _user = MutableStateFlow<UserDto?>(null)
    override val user: StateFlow<UserDto?> = _user.asStateFlow()

    init {
        // On startup, try to load current user
        CoroutineScope(Dispatchers.IO).launch {
            runCatching { api.me() }
                .onSuccess { resp ->
                    if (resp.isSuccessful) _user.value = resp.body()
                }
        }
    }

    override suspend fun login(email: String, password: String): Result<UserDto> =
        runCatching {
            val resp = api.login(LoginBody(email, password))
            if (!resp.isSuccessful) throw Exception("Login failed: ${resp.code()}")
            val auth = resp.body() as AuthResponse
            _user.value = auth.user
            auth.user
        }

    override suspend fun register(
        fullName: String,
        email: String,
        password: String
    ): Result<UserDto> = runCatching {
        val resp = api.register(RegisterBody(fullName, email, password))
        if (!resp.isSuccessful) throw Exception("Register failed: ${resp.code()}")
        val auth = resp.body() as AuthResponse
        _user.value = auth.user
        auth.user
    }

    override suspend fun logout(): Result<Unit> = runCatching {
        api.logout()
        // clear persistent cookies
        CookieStores.jar(context).clear()
        _user.value = null
    }
}