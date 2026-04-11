# Technology Stack

## Framework & Build System

- **React 19.2.5**: UI framework
- **Create React App 5.0.1**: Build tooling and development server
- **React Router DOM 6.30.3**: Client-side routing

## Styling

- **Tailwind CSS 4.2.2**: Utility-first CSS framework
- **PostCSS 8.5.9**: CSS processing
- **Autoprefixer 10.4.27**: CSS vendor prefixing

## Key Libraries

- **Leaflet 1.9.4** + **react-leaflet 5.0.0**: Interactive map visualization
- **i18next 26.0.4** + **react-i18next 17.0.2**: Internationalization (i18n)
- **Web Speech API**: Voice search (browser native)

## Testing

- **@testing-library/react 16.3.2**: React component testing
- **@testing-library/jest-dom 6.9.1**: Jest DOM matchers
- **@testing-library/user-event 13.5.0**: User interaction simulation

## Common Commands

### Development
```bash
cd nourishnet-app
npm start  # Starts dev server at http://localhost:3000
```

### Testing
```bash
npm test  # Runs test suite in watch mode
```

### Building
```bash
npm run build  # Creates production build in build/ folder
```

### Deployment
```bash
npm run deploy  # Deploys to GitHub Pages (if configured)
```

## Installation Notes

- Use `--legacy-peer-deps` flag if encountering peer dependency conflicts
- Leaflet requires CSS import in addition to package installation
- i18n requires initialization configuration in utils/i18n.js
