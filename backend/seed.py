"""Run once: python seed.py  (needs MONGO_URL, DB_NAME in .env)"""
import asyncio
from lib.db import db
from models.schemas import ContentItem, SiteSettings

def svc(i, slug, title, icon, short, price):
    return dict(id=f"svc-{slug}", slug=slug, title=title, order=i, active=True, icon=icon, short=short,
        hero_line=title, description=short, features=["Free consultation", "Written quote", "Support after launch"],
        process=[], faqs=[], demo=(slug == "home-automation"),
        packages=[dict(name="Starter", price=price, duration="1-2 weeks", features=["Basic scope", "1 revision round"])])

SERVICES = [
    svc(1, "website-making", "Website Making", "Globe", "Fast, mobile-first business websites.", 9999),
    svc(2, "app-making", "App Making", "Smartphone", "Android and iOS apps for your business.", 29999),
    svc(3, "home-automation", "Home Automation", "House", "Control lights, fans and locks from your phone.", 7999),
    svc(4, "office-automation", "Office Automation", "Building2", "Automate attendance, billing and workflows.", 14999),
    svc(5, "presentation-making", "Office Presentation Making", "Presentation", "Professional decks for pitches and meetings.", 999),
    svc(6, "school-college-projects", "College & School Digital Project Building", "GraduationCap", "Project building with guidance.", 1999),
    svc(7, "ai-agent-building", "AI Agent Building", "Bot", "Custom AI agents for support and sales.", 19999),
    svc(8, "other-digital-services", "Other Digital Services", "Sparkles", "Tell us what you need.", 999),
]

async def main():
    for name, items in {"services": SERVICES,
        "testimonials": [dict(id="t1", title="Happy Client", role="Business Owner", rating=5, text="Great work, delivered on time.", order=1, active=True)],
        "faqs": [dict(id="f1", title="How do I get a quote?", text="Fill the contact form or WhatsApp us.", order=1, active=True)],
        "apps": [], "portfolio": [], "banners": []}.items():
        await db[name].delete_many({})
        if items:
            await db[name].insert_many([ContentItem(**i).model_dump() for i in items])
    await db.settings.update_one({"id": "site"}, {"$set": {**SiteSettings().model_dump(), "id": "site"}}, upsert=True)
    print("Seeded")

asyncio.run(main())
