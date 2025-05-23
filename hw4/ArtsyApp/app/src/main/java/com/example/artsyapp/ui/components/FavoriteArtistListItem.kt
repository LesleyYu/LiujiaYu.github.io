package com.example.artsyapp.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.artsyapp.R
import com.example.artsyapp.data.model.FavoriteDto
import androidx.compose.ui.res.painterResource
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Composable
fun FavoriteArtistListItem(
    fav: FavoriteDto,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(12.dp)
        ) {
            // Artist image (or placeholder)
            AsyncImage(
                model = fav.imgUrl,
                placeholder = painterResource(R.drawable.artsy_logo),
                error = painterResource(R.drawable.artsy_logo),
                contentDescription = "${fav.title} image",
                modifier = Modifier
                    .size( fiftysixDp )
                    .clip(CircleShape)
            )

            Spacer(modifier = Modifier.width( sixteenDp ))

            // Textual info
            Column(modifier = Modifier.weight(1f)) {
                // Artist name
                Text(
                    text = fav.title,
                    style = MaterialTheme.typography.titleMedium
                )

                // Optional: nationality & birthday
//                val details = buildString {
//                    fav.nationality?.let { append(it) }
//                    fav.birthday?.let {
//                        if (isNotEmpty()) append(" • ")
//                        append("Born $it")
//                    }
//                }
//                if (details.isNotEmpty()) {
//                    Text(
//                        text = details,
//                        style = MaterialTheme.typography.bodySmall
//                    )
//                }

                // Added timestamp (formatted)
                val addedText = runCatching {
                    Instant.parse(fav.addedAt)
                        .atZone(ZoneId.systemDefault())
                        .format(DateTimeFormatter.ofPattern("MMM d, yyyy"))
                }.getOrNull() ?: fav.addedAt

                Text(
                    text = "Added: $addedText",
                    style = MaterialTheme.typography.bodySmall
                )
            }

            // Right‑arrow icon
            Icon(
                painter = painterResource(R.drawable.right_arrow),
                contentDescription = null,
                modifier = Modifier.size(24.dp)
            )
        }
    }
}

// to avoid the "magic number" warnings; you can inline these if you prefer
private val fiftysixDp = 56.dp
private val sixteenDp = 16.dp