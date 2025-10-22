# 📊 Body Composition Tracker - Web Version

A Progressive Web App (PWA) for tracking body composition metrics. Works entirely in your browser with no backend required!

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for phones and tablets
- 💾 **Offline Support** - Works without internet after first load
- 🏠 **Add to Home Screen** - Install like a native app
- 📊 **13 Metrics** - Track weight, fat %, muscle mass, BMR, and more
- 📈 **Beautiful Charts** - Visualize your progress over time
- 📅 **Date Filtering** - Focus on specific time periods
- 📤 **Export/Import** - Backup and restore your data
- 🔒 **Privacy-First** - All data stays in your browser

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. **Upload to GitHub:**
   - Create a new repository
   - Upload all files from this folder
   - Go to Settings → Pages
   - Select "main" branch
   - Save

2. **Access your app:**
   - Your app will be at: `https://yourusername.github.io/repo-name`
   - Share this link with friends!

### Option 2: Local Testing

1. **Simple HTTP Server (Python):**
   ```bash
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000`

2. **Or use any local server:**
   - VS Code Live Server extension
   - Node.js `http-server`
   - Any web server

## 📱 Installing on Phone

### iPhone (Safari):
1. Open the website
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen!

### Android (Chrome):
1. Open the website
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen!

## 💾 Data Storage

- **Where:** Browser's LocalStorage
- **Persistence:** Data stays until you clear browser data
- **Backup:** Use Export feature regularly
- **Restore:** Use Import feature to restore from backup

## 📊 Tracked Metrics

1. Weight (kg)
2. Fat %
3. Fat Mass (kg)
4. FFM (Fat-Free Mass)
5. Muscle Mass (kg)
6. TBW (Total Body Water) - kg
7. TBW (Total Body Water) - %
8. Bone Mass (kg)
9. BMR (Basal Metabolic Rate) - kJ
10. BMR (Basal Metabolic Rate) - kcal
11. Metabolic Age
12. Visceral Fat Rating
13. BMI

## 🎯 Usage Tips

### Adding Measurements:
1. Tap "➕ Add Measurement"
2. Enter your metrics
3. Tap "Save"

### Viewing Progress:
1. Select a metric from dropdown
2. Chart appears automatically
3. Use date filters to focus on specific periods

### Backing Up Data:
1. Tap menu (⋮)
2. Tap "📤 Export Data"
3. Save the JSON file somewhere safe

### Restoring Data:
1. Tap menu (⋮)
2. Tap "📥 Import Data"
3. Select your backup file

## 🔧 Technical Details

### Files:
- `index.html` - Main app structure
- `style.css` - Responsive styling
- `app.js` - Application logic & LocalStorage
- `manifest.json` - PWA configuration
- `sw.js` - Service Worker for offline support
- `icon-192.png` - App icon (192x192)
- `icon-512.png` - App icon (512x512)

### Technologies:
- Pure HTML/CSS/JavaScript (no frameworks!)
- Chart.js for visualizations
- LocalStorage API for data persistence
- Service Worker for offline functionality
- Web App Manifest for installability

### Browser Support:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🎨 Customization

### Change Colors:
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #3b82f6;  /* Change this! */
    --secondary-color: #6366f1;
    ...
}
```

### Add More Metrics:
Edit the `METRICS` array in `app.js`

### Modify Layout:
Edit `index.html` and `style.css`

## ⚠️ Important Notes

### Data Persistence:
- Data is stored in browser's LocalStorage
- Clearing browser data = losing measurements
- **Always export backups regularly!**

### Multi-Device:
- Data is NOT synced across devices
- Each device has its own data
- Use Export/Import to transfer data

### Privacy:
- All data stays on your device
- No server, no tracking, no analytics
- Completely private!

## 🐛 Troubleshooting

### Data Not Saving:
- Check if browser allows LocalStorage
- Try different browser
- Check browser storage settings

### App Not Installing:
- Make sure you're using HTTPS (required for PWA)
- GitHub Pages provides HTTPS automatically
- Local testing won't allow installation

### Charts Not Showing:
- Need internet for first load (Chart.js CDN)
- After first load, works offline

## 📦 Deployment Checklist

Before deploying to GitHub Pages:

- [ ] All files uploaded
- [ ] Repository is public
- [ ] GitHub Pages enabled in settings
- [ ] Icons created (192x192 and 512x512)
- [ ] Test on mobile device
- [ ] Test Add to Home Screen
- [ ] Test offline functionality

## 🎉 You're All Set!

Your Body Composition Tracker is ready to use!

**Share the link with friends and start tracking! 💪📊**

---

## 📞 Support

For issues or questions:
- Check this README
- Test in different browser
- Clear browser cache and try again

## 📄 License

Free to use and modify!

---

**Made with ❤️ for easy health tracking**