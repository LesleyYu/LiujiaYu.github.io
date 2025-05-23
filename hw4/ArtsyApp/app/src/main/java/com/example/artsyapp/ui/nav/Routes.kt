package com.example.artsyapp.ui.nav

sealed class Route(val path: String) {
    object Splash : Route("splash")
    object Home : Route("home")
    object Search : Route("search")
    object Detail : Route("detail/{id}") {
        fun create(id: String) = "detail/$id"
    }
    object Login : Route("login")
    object Register : Route("register")
}