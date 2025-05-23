package com.example.artsyapp.viewmodel

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
//import com.example.artsyapp.data.model.ArtistDetailDto
import com.example.artsyapp.data.model.ArtistDto
import com.example.artsyapp.data.model.ArtworkDto
import com.example.artsyapp.data.model.CategoryDto
import com.example.artsyapp.data.repository.ArtistRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface DetailUiState {
    object Loading : DetailUiState
    data class Error(val message: String) : DetailUiState
    data class Data(
        val artist: ArtistDto, // ArtistDetailDto,
        val artworks: List<ArtworkDto>,
        val similar: List<ArtistDto>,
        val isFavorite: Boolean
    ) : DetailUiState
}

@HiltViewModel
class DetailViewModel @Inject constructor(
    private val repo: ArtistRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val artistId: String = requireNotNull(savedStateHandle["id"])
    private val _ui = MutableStateFlow<DetailUiState>(DetailUiState.Loading)
    val ui: StateFlow<DetailUiState> = _ui.asStateFlow()

    init {
        reload()
    }

    /* ---------- public API ---------- */

    fun reload() = viewModelScope.launch {
        _ui.value = DetailUiState.Loading
        val result = repo.fullArtist(artistId)
        if (result.isSuccess) {
            // unwrap the bundle or show an error if it's somehow null
            result.getOrNull()?.let { bundle ->
                _ui.value = DetailUiState.Data(
                    artist     = bundle.artist,
                    artworks   = bundle.artworks,
                    similar    = bundle.similar,
                    isFavorite = bundle.starred
                )
            } ?: run {
                _ui.value = DetailUiState.Error("No data returned")
            }
        } else {
            // pull out the exception message (or a generic one)
            val msg = result.exceptionOrNull()?.message ?: "Could not load artist"
            _ui.value = DetailUiState.Error(msg)
        }
//        when (val res = repo.fullArtist(artistId)) {
//            is Result.Success -> _ui.value = DetailUiState.Data(    // error here: Unresolved reference 'Success'.
//                artist   = res.value.artist,    // error here: 1) Cannot access 'val value: Any?': it is internal in 'kotlin/Result'.  2) Unresolved reference 'artist'.
//                artworks = res.value.artworks,  // error here: 1) Cannot access 'val value: Any?': it is internal in 'kotlin/Result'. 2) Unresolved reference 'artworks'.
//                similar  = res.value.similar,   // error here: 1) Cannot access 'val value: Any?': it is internal in 'kotlin/Result'. 2) Unresolved reference 'similar'.
//                isFavorite = res.value.starred  // error here: 1)  Cannot access 'val value: Any?': it is internal in 'kotlin/Result'. 2) Unresolved reference 'starred'.
//            )
//            is Result.Failure -> _ui.value =    // error here: Cannot access 'class Failure : Serializable': it is internal in 'kotlin/Result'.
//                DetailUiState.Error(res.exception.message ?: "Could not load artist")
//        }
    }

    fun toggleFavorite() = viewModelScope.launch {
        val current = (_ui.value as? DetailUiState.Data)?.artist
        if (current != null) {
            repo.toggleFavorite(current)
            reload()
        }
    }

    suspend fun loadCategoriesFor(id: String): List<CategoryDto> {
        return repo.loadCategories(id).getOrElse { emptyList() }
    }
}