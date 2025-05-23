package com.example.artsyapp.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.artsyapp.R
import com.example.artsyapp.data.model.ArtistDto

@Composable
fun ArtistCard(
    artist: ArtistDto,
    onClick: () -> Unit,
    onStarClick: () -> Unit,
    isFavorite: Boolean = false,    // todo
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = RoundedCornerShape(8.dp)
    ) {
        Box {
            // main image
            AsyncImage(
                model = artist.imgUrl,
                placeholder = painterResource(R.drawable.artsy_logo),
                error = painterResource(R.drawable.artsy_logo),
                contentDescription = "${artist.title} image",
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentScale = ContentScale.Crop
            )
            // title
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(40.dp)
                    .align(Alignment.BottomStart)
                    .background(
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
                    )
                    .padding(horizontal = 10.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Text(
                    text = artist.title,
                    style = MaterialTheme.typography.titleMedium
                )
            }
            // right arrow
            Icon(
                painter = painterResource(R.drawable.right_arrow),
                contentDescription = "Go",
                modifier = Modifier
                    .size(16.dp)
                    .align(Alignment.BottomEnd)
                    .padding(8.dp),
            )
            // fav icon
            IconButton(
                onClick = onStarClick,
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
                    .size(45.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(30.dp)
                        .background(
                            color = MaterialTheme.colorScheme.primary,
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    val iconRes = if (isFavorite) R.drawable.star_filled else R.drawable.star_border
                    Icon(
                        painter = painterResource(iconRes),
                        contentDescription = if (isFavorite) "Unfavorite" else "Favorite"
                    )
                }
            }
        }
    }
}
