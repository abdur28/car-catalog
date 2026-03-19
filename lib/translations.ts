// Japanese → English brand translations
export const brandTranslations: Record<string, string> = {
  "トヨタ": "Toyota",
  "ホンダ": "Honda",
  "日産": "Nissan",
  "マツダ": "Mazda",
  "スバル": "Subaru",
  "三菱": "Mitsubishi",
  "スズキ": "Suzuki",
  "ダイハツ": "Daihatsu",
  "レクサス": "Lexus",
  "インフィニティ": "Infiniti",
  "アキュラ": "Acura",
  "いすゞ": "Isuzu",
  "光岡": "Mitsuoka",
  "ベンツ": "Mercedes-Benz",
  "メルセデス・ベンツ": "Mercedes-Benz",
  "BMW": "BMW",
  "アウディ": "Audi",
  "フォルクスワーゲン": "Volkswagen",
  "ポルシェ": "Porsche",
  "ボルボ": "Volvo",
  "フォード": "Ford",
  "シボレー": "Chevrolet",
  "ジープ": "Jeep",
  "クライスラー": "Chrysler",
  "キャデラック": "Cadillac",
  "フェラーリ": "Ferrari",
  "ランボルギーニ": "Lamborghini",
  "マセラティ": "Maserati",
  "アルファロメオ": "Alfa Romeo",
  "フィアット": "Fiat",
  "プジョー": "Peugeot",
  "シトロエン": "Citroen",
  "ルノー": "Renault",
  "ジャガー": "Jaguar",
  "ランドローバー": "Land Rover",
  "ミニ": "MINI",
  "ロールスロイス": "Rolls-Royce",
  "ベントレー": "Bentley",
  "アストンマーティン": "Aston Martin",
  "テスラ": "Tesla",
  "ヒュンダイ": "Hyundai",
  "キア": "Kia",
};

// Japanese → English transmission types
export const transmissionTranslations: Record<string, string> = {
  "AT": "Automatic",
  "MT": "Manual",
  "CVT": "CVT",
  "DCT": "DCT",
  "AMT": "Automated Manual",
  "オートマ": "Automatic",
  "マニュアル": "Manual",
  "セミオートマ": "Semi-Automatic",
};

// Japanese → English fuel types
export const fuelTranslations: Record<string, string> = {
  "ガソリン": "Gasoline",
  "軽油": "Diesel",
  "ディーゼル": "Diesel",
  "ハイブリッド": "Hybrid",
  "電気": "Electric",
  "EV": "Electric",
  "プラグインハイブリッド": "Plug-in Hybrid",
  "PHV": "Plug-in Hybrid",
  "PHEV": "Plug-in Hybrid",
  "LPG": "LPG",
  "CNG": "CNG",
  "水素": "Hydrogen",
};

// Japanese → English body types
export const bodyTypeTranslations: Record<string, string> = {
  "セダン": "Sedan",
  "ハッチバック": "Hatchback",
  "ワゴン": "Wagon",
  "ステーションワゴン": "Station Wagon",
  "クーペ": "Coupe",
  "オープン": "Convertible",
  "カブリオレ": "Convertible",
  "SUV": "SUV",
  "クロカン": "SUV",
  "ミニバン": "Minivan",
  "ワンボックス": "Van",
  "軽自動車": "Kei Car",
  "コンパクト": "Compact",
  "ピックアップ": "Pickup",
  "トラック": "Truck",
  "バス": "Bus",
  "福祉車両": "Welfare Vehicle",
  "キャンピング": "Camper",
};

// Japanese → English color names
export const colorTranslations: Record<string, string> = {
  "白": "White",
  "ホワイト": "White",
  "パール": "Pearl White",
  "黒": "Black",
  "ブラック": "Black",
  "シルバー": "Silver",
  "銀": "Silver",
  "グレー": "Gray",
  "灰": "Gray",
  "赤": "Red",
  "レッド": "Red",
  "青": "Blue",
  "ブルー": "Blue",
  "紺": "Navy",
  "ネイビー": "Navy",
  "緑": "Green",
  "グリーン": "Green",
  "黄": "Yellow",
  "イエロー": "Yellow",
  "オレンジ": "Orange",
  "茶": "Brown",
  "ブラウン": "Brown",
  "ベージュ": "Beige",
  "ゴールド": "Gold",
  "金": "Gold",
  "ピンク": "Pink",
  "紫": "Purple",
  "パープル": "Purple",
  "ワイン": "Wine Red",
  "ガンメタ": "Gunmetal",
};

export function translateBrand(jp: string): string {
  return brandTranslations[jp] || jp;
}

export function translateTransmission(jp: string): string {
  if (!jp) return jp;
  for (const [key, value] of Object.entries(transmissionTranslations)) {
    if (jp.includes(key)) return value;
  }
  return jp;
}

export function translateFuel(jp: string): string {
  if (!jp) return jp;
  for (const [key, value] of Object.entries(fuelTranslations)) {
    if (jp.includes(key)) return value;
  }
  return jp;
}

export function translateBodyType(jp: string): string {
  if (!jp) return jp;
  for (const [key, value] of Object.entries(bodyTypeTranslations)) {
    if (jp.includes(key)) return value;
  }
  return jp;
}

export function translateColor(jp: string): string {
  if (!jp) return jp;
  for (const [key, value] of Object.entries(colorTranslations)) {
    if (jp.includes(key)) return value;
  }
  return jp;
}

// Parse Japanese price string like "59.8万円" → 598000
export function parseJapanesePrice(priceStr: string): number | null {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[,\s]/g, "");

  // Match patterns like "59.8万円" or "598万円" or "応談" (negotiable)
  const manMatch = cleaned.match(/([\d.]+)万円?/);
  if (manMatch) {
    return Math.round(parseFloat(manMatch[1]) * 10000);
  }

  // Direct yen amount
  const yenMatch = cleaned.match(/([\d]+)円?/);
  if (yenMatch) {
    return parseInt(yenMatch[1], 10);
  }

  return null;
}

// Parse mileage string like "5.2万km" → 52000
export function parseMileage(mileageStr: string): number | null {
  if (!mileageStr) return null;
  const cleaned = mileageStr.replace(/[,\s]/g, "");

  const manMatch = cleaned.match(/([\d.]+)万km/i);
  if (manMatch) {
    return Math.round(parseFloat(manMatch[1]) * 10000);
  }

  const kmMatch = cleaned.match(/([\d]+)km/i);
  if (kmMatch) {
    return parseInt(kmMatch[1], 10);
  }

  return null;
}
