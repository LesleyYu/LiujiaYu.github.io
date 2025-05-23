@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.artsyapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import androidx.navigation.NavHostController
import com.example.artsyapp.R
import com.example.artsyapp.ui.nav.Route
import com.example.artsyapp.viewmodel.HomeUiState
import com.example.artsyapp.viewmodel.HomeViewModel
import com.example.artsyapp.ui.components.FavoriteArtistListItem
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Composable
fun HomeScreen(
    nav: NavHostController,
    vm: HomeViewModel = hiltViewModel()
//    vm: HomeViewModel = viewModel()
) {
    val state by vm.ui.collectAsState()
    val uriHandler = LocalUriHandler.current

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = { TopSection(state, nav, vm) },
        bottomBar = {
            Text(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { uriHandler.openUri("https://www.artsy.net/") }
                    .padding(vertical = 28.dp),
                text = "Powered by Artsy",
                style = MaterialTheme.typography.bodySmall.copy(
                    fontStyle = FontStyle.Italic,
                    textAlign = TextAlign.Center
                ),
                color = MaterialTheme.colorScheme.onSurfaceVariant
//                style = MaterialTheme.typography.bodySmall.copy(fontStyle = FontStyle.Italic),
//                textAlign = TextAlign.Center
            )
        }
    ) { innerPadding ->
        Box(
            Modifier
                .padding(innerPadding)
                .padding(top = 24.dp)
                .fillMaxSize(),
            contentAlignment = Alignment.TopCenter
        ) {
            when (state) {
                is HomeUiState.Loading -> Text("Loading…")
                is HomeUiState.LoggedOut -> Button(
                    onClick = { nav.navigate(Route.Login.path) },
                    shape = RoundedCornerShape(50),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        contentColor   = MaterialTheme.colorScheme.onPrimary
                    )
                    ) {
                        Text("Log in to see favorites")
                    }
                is HomeUiState.LoggedIn -> {
                    val loggedIn = state as HomeUiState.LoggedIn
                    if (loggedIn.favorites.isEmpty()) {
                        Box(
                            Modifier
                                .padding(innerPadding)
                                .fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("No favorites")
                        }
                    } else {
                        LazyColumn(contentPadding = innerPadding) {
                            items(loggedIn.favorites) { fav ->
                                FavoriteArtistListItem(
                                    fav,
                                    onClick = { nav.navigate(Route.Detail.create(fav.artistId)) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TopSection(
    state: HomeUiState,
    nav: NavHostController,
    vm: HomeViewModel
) {
    val today = remember {
        LocalDate.now()
            .format(DateTimeFormatter.ofPattern("dd MMMM yyyy"))
    }

    Column {
        /* -- TopAppBar ---- */
        TopAppBar(
            title = { Text("Artist Search") },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = Color(0xFFE7EEFF),
                titleContentColor = MaterialTheme.colorScheme.onSurface
            ),
            actions = {
                IconButton(onClick = { nav.navigate(Route.Search.path) }) {
                    Icon(
                        painter = painterResource(R.drawable.search),
                        contentDescription = "Search"
                    )
                }
                when (state) {
                    is HomeUiState.LoggedIn -> IconButton(onClick = vm::logout) {
                        AsyncImage(
                            model = state.avatarUrl,
                            contentDescription = "User Avatar",
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                        )
                    }

                    else -> IconButton(onClick = { nav.navigate(Route.Login.path) }) {
                        Icon(
                            painter = painterResource(R.drawable.user),
                            contentDescription = "Login"
                        )
                    }
                }
            }
        )

        /* -- Date row ----- */
        Surface(
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = today,
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 4.dp)
            )
        }

        /* -- “Favorites” header -- */
        Surface(
            color = Color(0xFFF7F8FA),
            tonalElevation = 0.dp,
            modifier = Modifier
                .fillMaxWidth()
        ) {
            Text(
                text = "Favorites",
                modifier = Modifier.padding(vertical = 6.dp),
                style = MaterialTheme.typography.titleSmall.copy(
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                ),
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}
