@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.artsyapp.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.artsyapp.R
import com.example.artsyapp.ui.components.ArtworksTab
import com.example.artsyapp.ui.components.DetailsTab
import com.example.artsyapp.ui.components.SimilarTab
import com.example.artsyapp.viewmodel.DetailUiState
import com.example.artsyapp.viewmodel.DetailViewModel

@Composable
fun ArtistDetailScreen(
    nav: NavHostController,
    id: String,
    vm: DetailViewModel = hiltViewModel()
) {
    /* ---------- state ---------- */
    val uiState by vm.ui.collectAsState()
    var tabIndex by rememberSaveable { mutableIntStateOf(0) }

    /* ---------- UI ---------- */
    Scaffold(
        topBar = {
            TopAppBar(
                navigationIcon = {
                    IconButton(onClick = { nav.popBackStack() }) {
                        Icon(painterResource(R.drawable.arrow_back), null)
                    }
                },
                title = { Text(
                    when (uiState) {
                        is DetailUiState.Data -> (uiState as DetailUiState.Data).artist.title
                        else -> ""
                    }
                ) },
                actions = {
                    if (uiState is DetailUiState.Data) {
                        val d = uiState as DetailUiState.Data
                        IconToggleButton(
                            checked = d.isFavorite,
                            onCheckedChange = { vm.toggleFavorite() }
                        ) {
                            val icon = if (d.isFavorite)
                                R.drawable.star_filled else R.drawable.star_border
                            Icon(
                                painterResource(icon),
                                contentDescription = if (d.isFavorite) "Remove from favourites" else "Add to favourites"
                            )
                        }
                    }
                }
            )
        }
    ) { innerPadding ->
        /* ---------- tabs ---------- */
        val tabs = listOf("Details", "Artworks", "Similar")
        Column(Modifier.padding(innerPadding).fillMaxSize()) {
            TabRow(selectedTabIndex = tabIndex) {
                tabs.forEachIndexed { i, label -> Tab(
                    selected = tabIndex == i,
                    onClick = { tabIndex = i },
                    text = { Text(label) },
                    icon = {
                        val ico = listOf(
                            R.drawable.details_tab,
                            R.drawable.artworks_tab,
                            R.drawable.similar_tab
                        )[i]
                        Icon(painterResource(ico), contentDescription = label)
                    })
                }
            }
            /* ---------- tab content ---------- */
            Box(Modifier.fillMaxSize()) {
                when (uiState) {
                    DetailUiState.Loading -> {
                        Box(
                            modifier = Modifier.fillMaxSize().padding(innerPadding),
                            contentAlignment =  Alignment.Center
                        ) { CircularProgressIndicator() }
                    }
                    is DetailUiState.Error -> {
                        val msg = (uiState as DetailUiState.Error).message
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding),
                            contentAlignment = Alignment.Center
                        ) { Text(msg) }
                    }
                    is DetailUiState.Data -> {
                        val d = uiState as DetailUiState.Data
                        when (tabIndex) {
                            0 -> DetailsTab(d.artist)
                            1 -> ArtworksTab(
                                artworks = d.artworks,
                                loadCategories = { id -> vm.loadCategoriesFor(id)}
                            )
                            2 -> SimilarTab(d.similar /*, loggedIn = uiState.loggedIn*/ )
                        }
                    }
                }
            }
        }
    }

//    // Snackbars
//    uiState.event?.let { event ->     // error: Unresolved reference 'event'.     error in "let": Cannot infer type for this parameter. Please specify it explicitly.     error in"event": Cannot infer type for this parameter. Please specify it explicitly.
//        val snackbar = LocalSnackbarHostState.current   // error: Unresolved reference 'LocalSnackbarHostState'.
//        LaunchedEffect(event) { snackbar.showSnackbar(event) }  // error: Unresolved reference 'LaunchedEffect'.    Unresolved reference 'showSnackbar'.
//    }
}