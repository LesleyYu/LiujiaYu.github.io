## 4-6 Authentication

The project should support two types of clients: Guests and Authenticated users. **Part of the functionality will be available (and visible) only to users that are logged in. In short, authenticated users can (in addition to guest users’ privileges):**

1) **See "similar artists" section**
2) **Have a favorite list of artists (separate favorites page and add/remove buttons)**

You will need to implement 4 actions (endpoints):

1) Registration (available only to guests)
2) Login (available only to guests)
3) Log out (available only to authenticated users)
4) Delete account (available only to authenticated users)

Your frontend should track (know) if the user is logged in and show information about current user (if any).

Auth functional requirements:
1) Auth state should be persistent across page reloads (F5/Cmd+R)
2) Auth state should be shared across tabs
3) Information belonging to user (Profile, favorites) should match the current user
4) Log out functionality should permanently change the auth state (ex: if you log out and reload the page, you should be still logged out, regardless of the tab)
5) Visible elements should respect the state of authentication (elements that are only available to logged users should be hidden on log out and vice-versa)

Use JWT tokens and Cookies.


### 4-6-1 Registration Procedure

The frontend should send a request to the backend containing all the fields necessary to register a user. The fields include fullname, email, password.The backend should validate the data. If there is another registered user with the same email or some fields are missing or contain incorrect values, a proper error message should be returned. The frontend will rely on this message to display all validation errors for the corresponding fields.

The backend should generate a profile image URL using Gravata. You must use Node.js’s built-in "node:crypto" module to create the sha256 hash needed for Gravata.

The backend should insert the user’s data into the database. Users' data should minimally contain the following fields: fullname, email, password (hashed), profileImageUrl. We may have additional fields if necessary. Storing passwords in an irreversible hashed form using "bcrypt" npm package.

After the user’s information is inserted in the database, we need to create and return the JWT token to the frontend. In this assignment we will use cookies to set, store and send these tokens. Token and cookies should be set to be valid for 1 hour.

The **registration** page should be available to unauthenticated users only.

The form should have validation – all fields are required (use the REQUIRED attribute).
The *email* field should contain a valid email address. This validation should be performed on the client (use the PATTERN attribute). Additionally, validation errors coming from the backend should also be shown under a corresponding field. Validation errors disappear once the field value has been modified (and does not contain a frontend-checked error anymore). The "Register"
action button should be disabled while the form is empty or contains validation errors.

The login link should lead to the **login page**.

### 4-6-2 Login Procedure

The front end should send the *email* and *password* to the backend, once validation checks have been successful. The backend should look for a user matching the email and the password sent against the stored email and hash associated with the user. If the user is not found or the password does not match an error should be returned and properly shown on the frontend.

If a user is found and the password matches the hash, the user should be authenticated by responding with all required data to set up the session (with user profile data). Like with the registration process, use a JWT token and HTTP-only cookies with expiration offset set at 1 hour (for both JWT and the cookie).

The login page (and the menu) should be available to unauthenticated users only.

Form validation and behavior should be like the form described in the "Registration Procedure" section – all fields are required, email should be valid, "Login" button should be disabled until there are no validation errors.

**On a successful login, the frontend should redirect the user to the Search page and change the visual appearance of all elements according to a new auth state (described below).**

The Register link should lead to the **registration page**.

### 4-6-3 Logout Procedure

The Logout menu should be available to authenticated users only.

When the option "Log out" is clicked, it should send a request to the backend to clear the cookie. Additionally, the frontend should reflect a new unauthenticated state. If the user was previously on the page that requires authentication, redirect to the Search page.

### 4-6-4 Delete account Procedure

This menu should be available to authenticated users only. When this option is clicked, it should send a request to the backend to delete the user with all data associated and clear the cookie. The frontend should reflect a new unauthenticated (guest) state. If the user was previously on the page that requires authentication, redirect them to the Search page.

### 4-6-5 Current auth state

Once the user logs in, the page refresh should not affect the frontend's auth state (until the user logs
out / deletes his profile)!
Frontend in the authenticated state must store some profile data (profile, favorites), hence after the
page is refreshed, the frontend should be able to restore that data. There could be different approaches:
   1) "…/me" request.
        This approach suggests the following – once the page is loaded, the frontend immediately issues a specific request to the backend. This includes an additional endpoint (usually "…/me") that tries to authenticate users based on the JWT cookie (if provided) and returns some state (could be current user profile and maybe some other data) that usually has data like the "/login" endpoint.
        If there are no credentials provided (or they have expired/ are invalid) the corresponding response indicates to the frontend that the current state is "unauthenticated".
        If user data is returned – frontend can just use this data and change auth state to "authenticated".
   2) Local storage. We don’t recommend persisting user data in the localStorage, since it might be impossible to determine the consistency of localStorage data against the data in the HTTP-only Cookie (ex: it can be expired or cleared), since JS cannot read it. There are some workarounds, however they could simply lower the security.

## 4-7 User Favorites

This project allows authenticated users to store a list of favorite artists. The backend should keep this list associated with user (and store it in the database) and support the following actions:

1) Adding an artist to the user’s favorites list      // 我靠 注意： 我的 addFavorite 方法里面 req.body 里要传入的信息是从 search artist 里面来的。直接全都对上了
2) Removing an artist from the user’s favorite list
3) Retrieving user’s favorites

The backend should also track the moment of time when the artist was added. Later, the frontend should display them in the "newest-first" order.

The list should be deleted once the user is deleted.

This list should be returned along with the user profile. i.e., the frontend should have this list (and maintain its consistency) as soon as possible to correctly display artists' state on the screen.

## 4-8 Page Layout

The page contains a header section, a content section and a footer section arranged vertically.

The header section has a bar (Use Bootstrap navbar component) containing the site title "Artist Search" on its left and a menu on the right. Items available in the menu depend on whether the user is logged in or not: for unauthenticated users - Search, Log In, Register; for authenticated users - Search, Favorites and a profile dropdown.

Profile dropdown consists of a static part and a dropdown itself. Static part should have user’s avatar (from Gravatar.com), full name and a caret. Click on the static parts triggers dropdown and it opens/closes. Any click outside the dropdown, as well as the "ESC" key press closes the dropdown. Dropdown consists of two items: "Delete account" and "Log out".

The content section contains the contents of the page, in which the following features will be shown.

## 4-9 Search Form

When a user opens the page for the first time, only a search form (Use Bootstrap Forms) is shown in the content section. Search form contains three items: an input section, a search button and a clear button.

The behavior of the Clear button is described in Section "Clear Button of the Search Form".

The Search button is enabled if and only if the input section contains some input. (Use disabled attribute)

Artist names will be entered into the input section of the search form. The input section has the placeholder value "Please enter an artist name.", which is shown when the input field is empty. When the input section is focused, its style changes: sky-blue bolded border.

Users can initiate a search by either 1) clicking the search button or 2) by hitting the enter key. Users cannot initiate search when the input section is empty because the search button is disabled. When the search is initiated, your frontend will do an AJAX call to the backend, sending the input text. Upon receiving the request, your backend will make a request to Artsy Search API, forwarding the input text to Artsy Search API via parameter q. Until a response is received from the backend, a spinner (Use Bootstrap spinners) will be shown near the search button.

When the response arrives, the spinner will be hidden, and the results are shown in the result list. The clear button of the search form brings the page to its initial state. It clears the input section, result list and artist details. Consequent page refresh shows the initial state of a cleared page.

## 4-10 Result List

The results of the search are shown as a list of cards (Use Bootstrap Cards). Each card contains the artist image with link retrieved from the `["_links"]["thumbnail"]["href"]` field of an artist resulting in the response of search endpoint. Below the image, the artist’s name is listed corresponding to the `["title"]` field of the artist result. The list of result cards is scrollable. The artist names have a blue background color (HTML Color Code: #205375).

If the search results are empty, i.e. no artists match the given query, an error message containing text "No results." will be shown (Use Check Bootstrap Alerts).

When a card is hovered, its background color changes as shown below.

When the user is authenticated, the artist card should contain a button with a star icon. If the artist is not in favorites, the star should have no fill. If the artist is in favorites, the star should have a yellow fill. Click on the button toggles the state – adds and removes an artist to/from favorites. This change should be reflected immediately everywhere it is shown (for example, in the Artist Info tab) and trigger the notification logic described in the favorites section below.

When an artist card is clicked, your frontend will do an AJAX call to your backend to get artist details. To get artist details, you must send an artist ID to the backend. For that, you must associate artist IDs with cards, which you can do during initial search by sending artist IDs from your backend to the frontend as a part of the response. Detail view will contain two tabs – "Artist Info" (Selected by default) and "Artworks" Until a response is received from the backend, a spinner is shown for both tabs.

## 4-11 Artist Details (front-end)

Artist details are shown in two tabs: Artist Info and Artworks (Use Bootstrap Navs and Tabs).

### 4-11-1 Artist Info Tab

Artist Info tab contains the same information as Assignment 2. It includes artist name, artist birth year, artist death year, artist nationality and artist biography retrieved from Artists endpoint as shown below.

The first line contains the name of the artist. Next line contains the nationality of the artist, followed by birth and death days. Notice the "en dash" between dates. Next, the biography is shown. Notice proper paragraph separation and no split words for a line break (See "By 1911-12, Cubism". Original text: "By 1911–12, Cub- ism").

This information corresponds to ["name"], ["birthday"], ["deathday"], ["nationality"] and ["biography"] fields of the artist's endpoint response. Similar to Assignment 2, if any of the fields are empty, you should simply leave them blank.

If content does not fit the screen, the whole page should be scrollable.

**Open description (tabs and their contents) should be restored after the page refresh, however search results should hide, and search input should reset. You should design and implement it the way, one may easily share the description with others (e.g. via socials) by url only (the page url should contain enough information for frontend to restore the page state).**

**For authenticated users there are two main changes – a "star" button and similar artist section.**

**The "star" button should behave like the "star" button on an artist card.**

**Under the description with biography there should be a block titled "Similar Artists". Please use the corresponding artsy endpoint to get the list from your backend. Similar artists should be displayed in the form of cards that should look and behave exactly as artist cards in the search result section. You can use the same frontend components. Upon click (except on the star button), they should change the content of sections above to the artist from the card. Leave search results unchanged (but reset selected state if description does not match the artist currently being displayed).**

### 4-11-2 Artworks Tab

The Artworks tab contains the artworks of the selected artist. Artworks are retrieved from the Artworks endpoint.

Each artwork has an image corresponding to the `["links"]["thumbnail"]["href"]` field of the artwork, a name corresponding to the ["title"] field of the artwork (See Section 4-2-4) and a creation year corresponding to the ["date"] field of the artwork (See Section 4-2-4). Artworks are listed using Bootstrap Cards.

If an artist does not have any Artworks in Artsy, you should show an error message containing text "No artworks.".

A "Categories" button below each artwork opens a modal (Hint: See Bootstrap Modals) in which categories for the artwork retrieved from the Genes Endpoint (See Section 4-2-5) are shown.

### 4-11-3 Categories Modal

The category modal has a title and a content section separated by a line.

The title section contains the image of the artwork, name of the artwork and creation date of the artwork. The Content section contains the categories of the artwork retrieved from the Genes Endpoint.

Each category has a name corresponding to the ["name"] field of the gene (See Section 4-2-5) and an image corresponding to the `["_links"]["thumbnail"]["href"]` field of the gene (See Section 4-2-5).

When the "Categories" button of an artwork is clicked, the modal is opened, and a request is sent to the backend to retrieve the categories (or genes) of an artwork. To get categories, you must send artwork ID to the backend. You can associate artwork IDs with "Categories" buttons using the IDs provided by the Artworks endpoint.

Until a response arrives, a spinner is shown in the content section of the modal as shown below. Spinner is replaced by the categories when the response arrives. Each category is shown using a Bootstrap Card.

If a particular artwork does not have any categories, an error message containing the text "No categories." Is shown in the content section of the modal.

## 4-12 Clear Button of the Search Form

The clear button of the search form brings the page to its initial state. It clears the input section, result list and artist details.

## 4-13 Favorites page

**This page is only available to authenticated users.**

**While loading, a spinner should be shown. To improve user experience, the list of favorite artists should be maintained, so on navigation from another screen, there should be no loading from the server, hence no spinner. The loading should only occur on page (full) reload.**

**If there are no artist in favorites, a "No favorite artists" message should be shown.**

**If there are some artists in the list, they should be displayed as cards in the "newest first" order.**

**The Favorite artist card should contain the following information: full name, dates of birth and death, nationality, interactive timer representing relative time of when the artist was added to the favorites and a blurred background image (the same image used on artist card in search results or in the similar artists list).**

**The Interactive timer is a relative time expressed with words which is auto updated. Some examples: for less than a minute, display "1 second ago"/"n seconds ago"; for more than a minute, but less than an hour display "1 minute ago" / "n minutes ago", etc.**

**The Card should support two interactions:**

1) **On "Remove" button click artist should be removed from the favorites list**
2) **On card click (except on "remove" button) user should be navigated to the "Artist Details" page with the artist being displayed. Search bar should be empty and there should be no search results. Both tabs should behave identically as they behave after artist details are being shown after search and select.**

## 4-14 Notifications

**Application should show confirmation in form of a top-right corner stackable notification for the following actions (with corresponding text and bootstrap style):**

1) **add to favorites – "Added to favorites" (style = success)**
2) **remove from favorites – "Removed from favorites" (style = danger)**
3) **logout – "Logged out" (style = success)**
4) **profile deletion – "Account deleted" (style = danger)**

**Notifications should be shown regardless of where the action has been made. These notifications should be visible for 3 seconds and automatically removed afterwards. In addition user may click "X" button on the right part of the notification to manually remove it. Notifications should stack vertically with the last notification triggered being on the bottom of the stack and the earliest being on the top. The stack grows from the top to the bottom of the page and persists between page navigations (not page reloads).**

## Responsive Design (front-end)

**The webpage you develop must be responsive. All functions should work on mobile devices.**
