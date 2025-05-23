package com.example.artsyapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.artsyapp.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import javax.inject.Inject

/* ---------- UI state ---------- */
@Serializable
sealed interface AuthUiState {
    @Serializable object Idle : AuthUiState
    @Serializable object Loading : AuthUiState
    @Serializable data class Error(val message: String) : AuthUiState
    @Serializable object Success : AuthUiState
}

/* ---------- View‑model ---------- */
/**
 * snackbars, navigation are sent through [event].
 */
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val repo: AuthRepository
) : ViewModel() {

    private val _ui = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val uiState: StateFlow<AuthUiState> = _ui.asStateFlow()

    private val _event = Channel<String>(Channel.BUFFERED)
    val event = _event.receiveAsFlow()

    /* ---------- actions ---------- */

    fun login(email: String, password: String) = viewModelScope.launch {
        _ui.value = AuthUiState.Loading
//        when (val res = repo.login(email, password)) {
//            is Result.Success -> {  // error here: Unresolved reference 'Success'.
//                _ui.value = AuthUiState.Success
//                _event.send("Logged in successfully")
//            }
//            is Result.Failure -> {  // error here: Cannot access 'class Failure : Serializable': it is internal in 'kotlin/Result'.
//                _ui.value = AuthUiState.Error(res.exception.message ?: "Login failed")
//            }
//        }
        val result = repo.login(email, password)
        if (result.isSuccess) {
            _ui.value = AuthUiState.Success
            _event.send("Logged in successfully")
        } else {
            val msg = result.exceptionOrNull()?.message ?: "Login failed"
            _ui.value = AuthUiState.Error(msg)
        }
    }

    fun register(fullName: String, email: String, password: String) = viewModelScope.launch {
        _ui.value = AuthUiState.Loading
//        when (val res = repo.register(fullName, email, password)) {
//            is Result.Success -> {  // error here: Unresolved reference 'Success'.
//                _ui.value = AuthUiState.Success
//                _event.send("Registered successfully")
//            }
//            is Result.Failure -> {  // error here: Cannot access 'class Failure : Serializable': it is internal in 'kotlin/Result'.
//                _ui.value = AuthUiState.Error(res.exception.message ?: "Register failed")
//            }
//        }
        val result = repo.register(fullName, email, password)
        if (result.isSuccess) {
            _ui.value = AuthUiState.Success
            _event.send("Registered successfully")
        } else {
            val msg = result.exceptionOrNull()?.message ?: "Register failed"
            _ui.value = AuthUiState.Error(msg)
        }
    }

    fun logout() = viewModelScope.launch { repo.logout() }
}