package com.example.artsyapp.ui.components

import android.widget.Space
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.artsyapp.R
//import com.example.artsyapp.data.model.ArtistDetailDto
import com.example.artsyapp.data.model.ArtistDto

@Composable
fun DetailsTab(
    artist: ArtistDto, // ArtistDetailDto,
    modifier: Modifier = Modifier
) {
    val scroll = rememberScrollState()
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(scroll)
            .padding(16.dp)
    ) {
        // artist name
        Text(
            artist.title,
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            ),
            modifier = Modifier.fillMaxWidth()
        )
        // one line info
        val life = buildString {
            artist.nationality?.takeIf { it.isNotBlank() }?.let { append(it) }
            val years = listOfNotNull(artist.birthday, artist.deathday).joinToString("-")
            if (years.isNotBlank()) {
                if (isNotEmpty()) append(", ")
                append(years)
            }
        }
        if (life.isNotBlank()) {
            Spacer(Modifier.height(4.dp))
            Text(
                life,
                style = MaterialTheme.typography.bodyMedium.copy(textAlign = TextAlign.Center),
                modifier = Modifier.fillMaxWidth()
            )
        }
        // biography
        artist.biography?.takeIf { it.isNotBlank() }?.let {
            Spacer(Modifier.height(12.dp))
            Text(it, style = MaterialTheme.typography.bodyMedium)
        }
    }
}



//        artist.nationality?.takeIf { it.isNotBlank() }?.let {
//            Spacer(Modifier.height(4.dp))
//            Text(it, style = MaterialTheme.typography.bodyMedium)
//        }
//        artist.birthday?.let {
//            Spacer(Modifier.height(4.dp))
//            Text("Born: $it", style = MaterialTheme.typography.bodyMedium)
//        }
//        artist.deathday?.let {
//            Spacer(Modifier.height(4.dp))
//            Text("Died: $it", style = MaterialTheme.typography.bodyMedium)
//        }