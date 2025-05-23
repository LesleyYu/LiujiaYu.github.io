package com.example.artsyapp.ui.components

import android.R.style
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.compose.SubcomposeAsyncImage
import coil.request.ImageRequest
import coil.size.Size
import com.example.artsyapp.R
import com.example.artsyapp.data.model.ArtworkDto
import com.example.artsyapp.data.model.CategoryDto
import kotlinx.coroutines.launch
import kotlin.math.max
import kotlin.math.min

@Composable
fun ArtworksTab(
    artworks: List<ArtworkDto>,
    modifier: Modifier = Modifier,
    loadCategories : suspend (artworkId: String) -> List<CategoryDto> // = { emptyList() }
) {
    var selected by remember { mutableStateOf<ArtworkDto?>(null) }
    val scope = rememberCoroutineScope()
    var categories by remember { mutableStateOf<List<CategoryDto>?>(null) }
    var loading by remember { mutableStateOf(false) }

    if (selected != null) {
        AlertDialog(
            onDismissRequest = {
                selected = null
                categories = null
                loading = false
            },
            confirmButton = {
                TextButton(onClick = {
                    selected = null
                    categories = null
                    loading = false
                }) { Text("Close") }
            },
            title = { Text(selected!!.title) },
            text = {
                if (loading) {
                    Box(Modifier.fillMaxWidth(), Alignment.Center) { CircularProgressIndicator() }
                } else {
                    categories?.takeIf { it.isNotEmpty() }?.let { CategoryCarousel(it) }
                        ?: Text("No categories")
                }
            }
        )
    }

    LazyColumn(modifier = modifier.fillMaxSize()) {
        if (artworks.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) { Text("No Artworks") }
            }
        } else {
            items(artworks) { art ->
                ArtworkCard(
                    artwork = art,
                    onCategories = {
                        selected = art
                        loading = true
                        scope.launch {
//                            Log.d("ArtworksTab", "Requesting categories for artworkId=${art.id}")
                            val result = runCatching { loadCategories(art.id) }
                            categories = result.getOrElse {
//                                Log.e("ArtworksTab", "Failed to load categories", it)
                                emptyList()
                            }
//                            Log.d("ArtworksTab", "Loaded categories: size=${categories?.size}")
                            loading = false
                        }
                    }
                )
            }
        }
    }
}

@Composable
private fun ArtworkCard(
    artwork: ArtworkDto,
    onCategories: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column {
            SubcomposeAsyncImage(
//                model = artwork.imgUrl,
//                contentDescription = artwork.title,
//                modifier = Modifier
//                    .fillMaxWidth()
////                    .defaultMinSize(minHeight = 1.dp)
////                    .height(180.dp),
////                contentScale = ContentScale.Fit
                model = ImageRequest.Builder(LocalContext.current)
                    .data(artwork.imgUrl)
                    .crossfade(true)
                    .size(Size.ORIGINAL)
                    .build(),
                contentDescription = artwork.title,
                modifier = Modifier
                    .fillMaxWidth()               // fill the card horizontally
                    .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp)),
                contentScale = ContentScale.FillWidth
            )
            Column(Modifier.padding(12.dp)) {
                Text(
                    artwork.title,
                    style = MaterialTheme.typography.titleMedium,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp)
                )
                Spacer(Modifier.height(8.dp))
                Button(
                    onClick = onCategories, modifier = Modifier.align(Alignment.CenterHorizontally)
                ) { Text("View categories") }
            }
        }
    }
}

@Composable
private fun CategoryCarousel(categories: List<CategoryDto>) {
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()
    Row(
        verticalAlignment = Alignment.CenterVertically
//       , modifier = Modifier.height(460.dp)
    ) {

        IconButton(
            onClick = {
                scope.launch {
                    listState.animateScrollToItem(
                        max(listState.firstVisibleItemIndex - 1, 0)
                    )
                }
            }
        ) { Icon(painter = painterResource(R.drawable.left_arrow), contentDescription = "Prev") }

        LazyRow(
            state = listState,
            modifier = Modifier.weight(1f), // .fillMaxHeight()
            contentPadding = PaddingValues(horizontal = 12.dp)
        ) {
            items(categories) { CategoryCard(it) }
        }

        IconButton(
            onClick = {
                scope.launch {
                    listState.animateScrollToItem(
                        min(
                            listState.firstVisibleItemIndex + 1,
                            categories.lastIndex
                        )
                    )
                }
            },
            Modifier.padding(1.dp)
        ) { Icon(painter = painterResource(R.drawable.right_arrow), contentDescription = "Next") }
    }
}

@Composable
private fun CategoryCard(category: CategoryDto, modifier: Modifier = Modifier) {
    Card(
        modifier
            .height(450.dp)
            .width(220.dp)
            .padding(horizontal = 1.dp),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(Modifier.fillMaxSize()) {
            AsyncImage(
                model = category.imgUrl,
                contentDescription = category.name,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp),
                contentScale = ContentScale.Crop
            )
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    category.name,
                    style = MaterialTheme.typography.titleSmall.copy(
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                )
                category.description?.let {
                    Text(
                        it,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )
                }
            }
        }
    }
}