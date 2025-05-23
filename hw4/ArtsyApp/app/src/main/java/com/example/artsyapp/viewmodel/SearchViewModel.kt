@file:OptIn(kotlinx.serialization.ExperimentalSerializationApi::class)
//@file:OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)

package com.example.artsyapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
//import com.example.artsyapp.data.model.ArtistDetailDto
import com.example.artsyapp.data.model.ArtistDto
import com.example.artsyapp.data.repository.ArtistRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import javax.inject.Inject

@Serializable
sealed interface SearchUiState {
    @Serializable object Idle : SearchUiState
    @Serializable object Loading : SearchUiState
    @Serializable object Empty : SearchUiState
    @Serializable data class Success(val artists: List<ArtistDto>) : SearchUiState
    @Serializable data class Error(val message: String) : SearchUiState
}

@OptIn(FlowPreview::class)
@HiltViewModel
class SearchViewModel @Inject constructor(
    private val repo: ArtistRepository
) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    private val _ui = MutableStateFlow<SearchUiState>(SearchUiState.Idle)
    val uiState: StateFlow<SearchUiState> = _ui.asStateFlow()

    init {
        viewModelScope.launch {
            _query
                .debounce(300)
                .distinctUntilChanged()
                .flatMapLatest { flowOf(it) }
                .onEach { q -> performSearch(q) }
                .launchIn(this)
        }
    }

    /* ---------- public API ---------- */

    fun onQueryChange(newQuery: String) {
        _query.value = newQuery
    }

    fun toggleFavorite(artist: ArtistDto) = viewModelScope.launch {
        repo.toggleFavorite(artist) //(artist.id ?: return@launch)     // Argument type mismatch: actual type is 'kotlin.String', but 'com.example.artsyapp.data.model.ArtistDto' was expected.
    }

    /* ---------- internal ---------- */

    private suspend fun performSearch(query: String) {
        if (query.length < 3) {
            _ui.value = SearchUiState.Idle
            return
        }

        _ui.value = SearchUiState.Loading
        val result = repo.search(query)
        result.fold(
            onSuccess = { list ->
                _ui.value = if (list.isEmpty()) {
                    SearchUiState.Empty
                } else {
                    SearchUiState.Success(list)
                }
            },
            onFailure = { throwable ->
                _ui.value = SearchUiState.Error(
                    throwable.message ?: "Unknown error"
                )
            }
        )
//        if (result.isSuccess) {
//            val list = result.value     // error here: Cannot access 'val value: Any?': it is internal in 'kotlin/Result'.
//            _ui.value = if (list.isEmpty()) //  error here:  Unresolved reference 'isEmpty'.
//                SearchUiState.Empty
//            else
//                SearchUiState.Success(list) //  error here: Argument type mismatch: actual type is 'kotlin.Any?', but 'kotlin.collections.List<com.example.artsyapp.data.model.ArtistDto>' was expected.
//        } else {
//            _ui.value = SearchUiState.Error(result.exception.message ?: "Unknown error")    //  error here: Unresolved reference 'exception'.
//        }
    }
}