#!/usr/bin/env bash
# pb-restore.sh — restores all Springfine PocketHost collections and records
# Uses curl directly to bypass Node.js network issues
# Run: bash scripts/pb-restore.sh

set -e
BASE="https://springfine.pockethost.io"
EMAIL="aturaerick@gmail.com"
PASS="dGY@SrzA86PQc5n"

echo "🔐 Authenticating..."
TOKEN=$(curl -sf --max-time 20 -X POST "$BASE/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$EMAIL\",\"password\":\"$PASS\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
echo "✅ Got token."

AUTH="-H \"Authorization: Bearer $TOKEN\""

# ── Helper functions ─────────────────────────────────────────────────────────

create_collection() {
  local NAME=$1
  local SCHEMA=$2
  echo -n "  📦 Creating: $NAME ... "
  RESULT=$(curl -sf --max-time 20 -X POST "$BASE/api/collections" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$SCHEMA" 2>&1) && echo "✅" || echo "⚠️  (may already exist)"
}

create_record() {
  local COL=$1
  local DATA=$2
  echo -n "    ➕ [$COL] ... "
  curl -sf --max-time 20 -X POST "$BASE/api/collections/$COL/records" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$DATA" > /dev/null && echo "✅" || echo "❌ failed"
}

# ── Delete existing ──────────────────────────────────────────────────────────

echo ""
echo "🗑️  Removing old collections..."
for COL in hero stats services gallery clients values contact_info director; do
  ID=$(curl -sf --max-time 10 "$BASE/api/collections/$COL" \
    -H "Authorization: Bearer $TOKEN" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null || true)
  if [ -n "$ID" ]; then
    curl -sf --max-time 10 -X DELETE "$BASE/api/collections/$ID" \
      -H "Authorization: Bearer $TOKEN" > /dev/null && echo "  🗑️  Deleted: $COL ($ID)" || echo "  ⚠️  Could not delete: $COL"
    sleep 0.5
  else
    echo "  ⚠️  Not found: $COL (skipping)"
  fi
done

# ── Create Collections ───────────────────────────────────────────────────────

echo ""
echo "📦 Creating collections..."

create_collection "hero" '{
  "name":"hero","type":"base","listRule":"","viewRule":"",
  "fields":[
    {"type":"text","name":"headline","required":true},
    {"type":"text","name":"subheadline","required":true},
    {"type":"text","name":"tagline"},
    {"type":"text","name":"cta_label"},
    {"type":"text","name":"badge1"},
    {"type":"text","name":"badge2"},
    {"type":"file","name":"background","maxSelect":1,"mimeTypes":["image/jpeg","image/png","image/webp"]},
    {"type":"file","name":"rig_image","maxSelect":1,"mimeTypes":["image/jpeg","image/png","image/webp"]}
  ]
}'

create_collection "stats" '{
  "name":"stats","type":"base","listRule":"","viewRule":"",
  "fields":[
    {"type":"number","name":"value","required":true},
    {"type":"text","name":"suffix"},
    {"type":"text","name":"label","required":true},
    {"type":"number","name":"order","required":true}
  ]
}'

create_collection "services" '{
  "name":"services","type":"base","listRule":"","viewRule":"",
  "fields":[
    {"type":"text","name":"title","required":true},
    {"type":"text","name":"desc","required":true},
    {"type":"text","name":"icon_name","required":true},
    {"type":"text","name":"badge"},
    {"type":"number","name":"order","required":true}
  ]
}'

create_collection "gallery" '{
  "name":"gallery","type":"base","listRule":"","viewRule":"",
  "fields":[
    {"type":"text","name":"title","required":true},
    {"type":"text","name":"desc"},
    {"type":"file","name":"image","required":true,"maxSelect":1,"mimeTypes":["image/jpeg","image/png","image/webp"]},
    {"type":"number","name":"order","required":true}
  ]
}'

create_collection "clients" '{
  "name":"clients","type":"base","listRule":"","viewRule":"",
  "fields":[
    {"type":"text","name":"name","required":true},
    {"type":"select","name":"variant","required":true,"maxSelect":1,"values":["engraved","bold","code"]},
    {"type":"number","name":"order","required":true}
  ]
}'

create_collection "values" '{
  "name":"values","type":"base","listRule":"","viewRule":"",
  "fields":[
    {"type":"text","name":"title","required":true},
    {"type":"text","name":"desc","required":true},
    {"type":"number","name":"order","required":true}
  ]
}'

create_collection "contact_info" '{
  "name":"contact_info","type":"base","listRule":"","viewRule":"",
  "fields":[
    {"type":"text","name":"phone","required":true},
    {"type":"text","name":"email","required":true},
    {"type":"text","name":"address","required":true},
    {"type":"text","name":"whatsapp"},
    {"type":"text","name":"po_box"}
  ]
}'

create_collection "director" '{
  "name":"director","type":"base","listRule":"","viewRule":"",
  "fields":[
    {"type":"text","name":"name","required":true},
    {"type":"text","name":"title","required":true},
    {"type":"text","name":"bio","required":true},
    {"type":"text","name":"quote","required":true},
    {"type":"text","name":"credentials","required":true},
    {"type":"file","name":"photo","maxSelect":1,"mimeTypes":["image/jpeg","image/png","image/webp"]}
  ]
}'

# ── Seed Records ─────────────────────────────────────────────────────────────

echo ""
echo "🌱 Seeding records..."

# HERO
create_record "hero" '{
  "headline":"SAVING WATER, SAVING EARTH.",
  "subheadline":"Innovative borehole drilling and water systems enhancing access to safe water in Kitale and beyond.",
  "tagline":"Save Water, Save Earth",
  "cta_label":"Get a Free Quote",
  "badge1":"EST. 2018",
  "badge2":"500+ PROJECTS"
}'

# STATS
create_record "stats" '{"value":500,"suffix":"+","label":"Boreholes Drilled","order":1}'
create_record "stats" '{"value":15,"suffix":"+","label":"Years Experience","order":2}'
create_record "stats" '{"value":8,"suffix":"","label":"Counties Served","order":3}'
create_record "stats" '{"value":98,"suffix":"%","label":"Client Satisfaction","order":4}'

# SERVICES
create_record "services" '{"title":"Groundwater Exploration","desc":"Hydrogeological surveys to identify the best drilling sites","icon_name":"Search","badge":"Specialized","order":1}'
create_record "services" '{"title":"Borehole Drilling","desc":"Professional drilling up to deep aquifer levels using modern rigs","icon_name":"Droplets","badge":"Primary","order":2}'
create_record "services" '{"title":"Pump Installation","desc":"Solar and electric pump systems for reliable water supply","icon_name":"Zap","badge":"Secondary","order":3}'
create_record "services" '{"title":"Water Quality Testing","desc":"Laboratory analysis to ensure safe, clean water","icon_name":"ShieldCheck","badge":"Standard","order":4}'
create_record "services" '{"title":"Borehole Rehabilitation","desc":"Restoration of old or underperforming boreholes","icon_name":"RotateCw","badge":"Maintenance","order":5}'
create_record "services" '{"title":"Piping & Distribution","desc":"End-to-end water reticulation system installation","icon_name":"Waves","badge":"Standard","order":6}'

# CLIENTS
create_record "clients" '{"name":"Kitale Water Authority","variant":"engraved","order":1}'
create_record "clients" '{"name":"TransNzoia County","variant":"bold","order":2}'
create_record "clients" '{"name":"AgroServe Kenya Ltd","variant":"code","order":3}'
create_record "clients" '{"name":"Western Seeds Co.","variant":"engraved","order":4}'
create_record "clients" '{"name":"Hope Springs NGO","variant":"bold","order":5}'
create_record "clients" '{"name":"Rift Valley Farms","variant":"code","order":6}'
create_record "clients" '{"name":"Meru Highlands Resort","variant":"engraved","order":7}'

# VALUES
create_record "values" '{"title":"Integrity","desc":"We operate with full transparency and honesty in every project we undertake.","order":1}'
create_record "values" '{"title":"Quality","desc":"High standards in every borehole, every system, every interaction with our clients.","order":2}'
create_record "values" '{"title":"Sustainability","desc":"Every solution is designed to serve communities for generations, respecting the environment.","order":3}'

# CONTACT INFO
create_record "contact_info" '{
  "phone":"+254 700 000000",
  "email":"info@springfine.co.ke",
  "address":"Kitale, Trans-Nzoia County, Kenya",
  "whatsapp":"+254 700 000000",
  "po_box":"P.O. Box 1234, Kitale"
}'

# DIRECTOR
create_record "director" '{
  "name":"John Atura",
  "title":"Founder & Managing Director",
  "bio":"Dedicated to providing sustainable water solutions to communities across Kenya. With a passion for engineering and environmental stewardship, he leads Springfine Hydrosolutions LTD with a commitment to excellence and integrity.",
  "quote":"Water is not just a resource; it is the foundation of life and community development.",
  "credentials":"NEMA Certified,WRMA Licensed,15+ Years Experience"
}'

# ── Verify ───────────────────────────────────────────────────────────────────

echo ""
echo "📊 Verification:"
for COL in hero stats services gallery clients values contact_info director; do
  COUNT=$(curl -sf --max-time 10 "$BASE/api/collections/$COL/records?perPage=1" \
    -H "Authorization: Bearer $TOKEN" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('totalItems',0))" 2>/dev/null || echo "?")
  echo "  ✅ $COL: $COUNT records"
done

echo ""
echo "🎉 All done! https://springfine.pockethost.io/_/"
