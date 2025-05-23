package com.example.artsyapp

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.artsyapp.ui.nav.Route
import com.example.artsyapp.ui.screens.HomeScreen
import com.example.artsyapp.ui.screens.SplashScreen
import com.example.artsyapp.ui.screens.SearchScreen
import com.example.artsyapp.ui.screens.ArtistDetailScreen
//import com.example.artsyapp.ui.screens.auth.LoginScreen
//import com.example.artsyapp.ui.screens.auth.RegisterScreen

@Composable
fun ArtistSearchApp() {
//    // call composable APIs
//    val context = LocalContext.current
//    val api: ApiService = remember { provideApiService(context) }   // Argument type mismatch: actual type is 'android.content.Context', but 'retrofit2.Retrofit' was expected.
    val nav = rememberNavController()

    NavHost(nav, startDestination = Route.Splash.path) {
        composable(Route.Splash.path) {
            SplashScreen(onFinished = { nav.navigate(Route.Home.path) {
                popUpTo(Route.Splash.path) { inclusive = true } } })
        }

        composable(Route.Home.path)          { HomeScreen(nav) }
        composable(Route.Search.path)        { SearchScreen(nav) }
//        composable(Route.Login.path)         { LoginScreen(nav) }
//        composable(Route.Register.path)      { RegisterScreen(nav) }

        composable(
            route = Route.Detail.path,
            arguments = listOf(navArgument("id") { type = NavType.StringType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getString("id")!!
            ArtistDetailScreen(nav, id)
        }
    }
}