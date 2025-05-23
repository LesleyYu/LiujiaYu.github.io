package com.example.artsyapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.artsyapp.viewmodel.SearchViewModel
import com.example.artsyapp.R
import com.example.artsyapp.ui.components.ArtistCard
import com.example.artsyapp.ui.nav.Route
import com.example.artsyapp.viewmodel.SearchUiState

@Composable
fun SearchScreen(
    nav: NavHostController,
//    vm: SearchViewModel = viewModel()
    vm: SearchViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsState()
    val query by vm.query.collectAsState()

    Column(Modifier.fillMaxSize()) {
        TextField(
            value = vm.query.collectAsState().value,
            onValueChange = vm::onQueryChange,
            leadingIcon = { Icon(painterResource(R.drawable.search), null) },
            trailingIcon = {
//                if (vm.query.value.isNotEmpty())    // error: StateFlow. value should not be called within composition Toggle
                if (query.isNotEmpty())
                    IconButton(onClick = { vm.onQueryChange("") }) {
                        Icon(painterResource(R.drawable.close), null)
                    }
            },
            placeholder = { Text("Search artists…") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 30.dp)
                .background(MaterialTheme.colorScheme.primary),
//            colors = TextFieldDefaults.textFieldColors(
//                cursorColor = MaterialTheme.colorScheme.onPrimary
//            )
        )

        when (state) {
            is SearchUiState.Loading -> LinearProgressIndicator(Modifier.fillMaxWidth())
            is SearchUiState.Empty    -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No results")
            }
            is SearchUiState.Success  -> LazyColumn {
                items((state as SearchUiState.Success).artists) { artist ->
                    ArtistCard(artist,
                        // todo: isFavorite?
                        onClick = { nav.navigate(Route.Detail.create(artist.id.toString())) },
                        onStarClick = { vm.toggleFavorite(artist) })
                }
            }
            is SearchUiState.Error -> Box(
                Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = (state as SearchUiState.Error).message,
                    color = MaterialTheme.colorScheme.error
                )
            }
            else -> {}
        }
    }
}