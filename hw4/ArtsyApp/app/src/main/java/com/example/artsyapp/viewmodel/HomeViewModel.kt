package com.example.artsyapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.artsyapp.data.model.FavoriteDto
import com.example.artsyapp.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import javax.inject.Inject

@Serializable
sealed interface HomeUiState {
    @Serializable object Loading : HomeUiState
    @Serializable data class LoggedOut(val message: String? = null) : HomeUiState
    @Serializable data class LoggedIn(
        val avatarUrl: String?,
        val favorites: List<FavoriteDto>
    ) : HomeUiState
}

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val authRepo: AuthRepository
) : ViewModel() {

    private val _ui = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val ui: StateFlow<HomeUiState> = _ui.asStateFlow()

    init {
        // Observe the current user & their favorites
        viewModelScope.launch {
            authRepo.user.collect { user ->
                _ui.value = if (user == null) {
                    HomeUiState.LoggedOut()
                } else {
                    HomeUiState.LoggedIn(
                        avatarUrl = user.profileImageUrl,
                        favorites = user.favorites
                    )
                }
            }
        }
    }

    /* ---------- actions ---------- */

    fun logout() = viewModelScope.launch { authRepo.logout() }
}