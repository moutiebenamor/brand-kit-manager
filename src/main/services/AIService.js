const fs = require('fs');
const path = require('path');

class AIService {
  constructor() {
    this.apiKey = this.loadApiKey();
  }

  loadApiKey() {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const match = content.match(/ANTHROPIC_API_KEY=(.+)/);
        return match ? match[1].trim() : null;
      }
    } catch (e) { /* ignore */ }
    return process.env.ANTHROPIC_API_KEY || null;
  }

  async generatePalette(baseColor, mood = 'modern') {
    // If no API key, use local generation via chroma-js logic
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      return this.generateLocalPalette(baseColor, mood);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: `Generate a brand color palette based on the color ${baseColor} with a ${mood} mood. Return ONLY valid JSON array with 6 color objects, each having: name (string), hex (string starting with #), category (one of: primary, secondary, accent, neutral). No markdown, no explanation, just the JSON array.`,
          }],
        }),
      });

      const data = await response.json();
      const text = data.content[0].text.trim();
      return JSON.parse(text);
    } catch (error) {
      console.error('AI palette generation failed, using local:', error.message);
      return this.generateLocalPalette(baseColor, mood);
    }
  }

  generateLocalPalette(baseColor, mood) {
    // Local palette generation using color math
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const hsl = this.rgbToHsl(r, g, b);
    const palettes = {
      modern: [0, 30, 60, 180, 210, 240],
      warm: [0, 15, 30, 45, -15, -30],
      cool: [0, -30, -60, 180, 150, 120],
      vibrant: [0, 72, 144, 216, 288, 36],
      minimal: [0, 0, 0, 180, 180, 180],
    };

    const offsets = palettes[mood] || palettes.modern;
    const categories = ['primary', 'primary', 'secondary', 'secondary', 'accent', 'neutral'];
    const names = ['Base', 'Light', 'Deep', 'Complement', 'Cool Accent', 'Neutral'];

    return offsets.map((offset, i) => {
      const newH = (hsl[0] + offset + 360) % 360;
      const newS = Math.min(100, Math.max(20, hsl[1] + (i % 2 === 0 ? 0 : -15)));
      const newL = Math.min(90, Math.max(15, hsl[2] + (i - 2) * 8));
      const rgb = this.hslToRgb(newH, i === 5 ? 10 : newS, newL);
      return {
        name: names[i],
        hex: `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`,
        category: categories[i],
      };
    });
  }

  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  async generateShades(baseColor) {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const hsl = this.rgbToHsl(r, g, b);

    const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    
    return weights.map(weight => {
      // Logic for shades: 50 is light, 500 is base (roughly), 950 is dark
      let newL;
      if (weight < 500) {
        // Lighten: 500 -> 50 (base L -> 95)
        newL = hsl[2] + (95 - hsl[2]) * (1 - (weight - 50) / 450);
      } else if (weight === 500) {
        newL = hsl[2];
      } else {
        // Darken: 500 -> 950 (base L -> 10)
        newL = hsl[2] - (hsl[2] - 10) * ((weight - 500) / 450);
      }

      // Saturation adjustment: lighten usually reduces saturation slightly, darken increases it
      const newS = Math.min(100, Math.max(10, hsl[1] + (weight < 500 ? -5 : 5)));
      
      const rgb = this.hslToRgb(hsl[0], newS, newL);
      return {
        name: `${weight}`,
        hex: `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`,
        category: weight === 500 ? 'primary' : 'neutral',
      };
    });
  }
}

module.exports = AIService;
