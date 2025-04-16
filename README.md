# Strapi Ownership Guard Plugin

A powerful Strapi plugin that helps protect your data by ensuring users can only access and modify data they own. This plugin adds an additional layer of security to your Strapi application by implementing ownership-based access control.

## Features

- 🔒 Automatic ownership validation for protected routes
- 🛡️ Protection against unauthorized access to data
- 🔄 Automatic user association with new records
- 📝 Configurable protected routes through the admin panel
- 🔍 Automatic filtering of collection queries to show only owned data
- 🔐 Support for both JWT and Firebase authentication

## Installation

1. Install the plugin using npm:

```bash
npm install sstrapi-plugin-data-ownership-guard
```

2. Rebuild your Strapi admin panel:

```bash
npm run build
```

3. Restart your Strapi server:

```bash
npm run develop
```

## Usage

### 1. Configure Protected Routes

1. Access the Strapi admin panel
2. Navigate to the "Ownership Guard" section in the left sidebar
3. Select the routes you want to protect
4. Save your configuration

### 2. Data Model Requirements

For the plugin to work properly, your content types must have a `user` relation field that associates records with their owners. The plugin will automatically:

- Associate new records with the authenticated user
- Filter collection queries to show only owned records
- Validate ownership before allowing modifications

### 3. Authentication

The plugin supports both JWT and Firebase authentication. Make sure your authentication system is properly configured before using the plugin.

### 4. Enabling APIs

<b>IMPORTANT:</b> You need to enable find and findOne APIs in user-permissions section under USER category to make the plugin able to work.<br />
You need to enable APIs that you want to protect by this plugin.<br />
note: Make sure you enable these APIs as <b>Authenticated</b> otehrwise you may receive unknow errors.

## How It Works

The plugin implements a middleware that:

1. Intercepts all API requests to protected routes
2. Validates the user's authentication
3. For GET requests:
   - Filters collection queries to show only owned records
   - Validates ownership for single record requests
4. For POST requests:
   - Automatically associates new records with the authenticated user
5. For PUT/DELETE requests:
   - Validates ownership before allowing modifications

## Error Handling

The plugin will return appropriate error responses:

- `403 Forbidden` when a user attempts to access/modify data they don't own
- `500 Internal Server Error` for any unexpected errors

## Upcoming Features

We're working on adding these exciting features in future releases:

- 🎯 Role-based ownership rules
- 🔄 Support for multiple ownership (shared resources)
- 📊 Ownership transfer functionality
- 🛡️ Supporting custom APIs
- 📱 Improved admin panel interface
- 📝 Enabling the field of the name of the field that plugin checks for ownership

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Abolfazl Younesi <abolfazl.younesi277@gmail.com>
