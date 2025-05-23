package com.example.artsyapp.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.artsyapp.data.model.ArtistDto
import com.example.artsyapp.ui.components.SimilarArtistCard

@Composable
fun SimilarTab(
    similar: List<ArtistDto>,
    modifier: Modifier = Modifier
) {
    if (similar.isEmpty()) {
        Box(modifier = modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No Similar Artists")
        }
    } else {
        LazyColumn(modifier = modifier.fillMaxSize()) {
            items(similar) { artist -> SimilarArtistCard(artist) }
        }
    }
}