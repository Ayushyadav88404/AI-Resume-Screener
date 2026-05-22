#!/usr/bin/env python3
"""
Clear Database Script

This script clears all data from the Resume Screener database.
Use with caution - this action cannot be undone!

Usage:
    python clear_db.py
"""

import os
import sqlite3
from pathlib import Path

DB_PATH = "resume_screener.db"


def clear_database():
    """Clear all tables from the database."""
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return False
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        if not tables:
            print("✅ Database is already empty")
            conn.close()
            return True
        
        # Display tables to be cleared
        print("📋 Tables to be cleared:")
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"  - {table_name}: {count} records")
        
        # Ask for confirmation
        print("\n⚠️  WARNING: This action cannot be undone!")
        confirm = input("Are you sure you want to clear the database? (yes/no): ").strip().lower()
        
        if confirm != 'yes':
            print("❌ Operation cancelled")
            conn.close()
            return False
        
        # Clear all tables
        for table in tables:
            table_name = table[0]
            cursor.execute(f"DELETE FROM {table_name};")
            print(f"✅ Cleared {table_name}")
        
        conn.commit()
        conn.close()
        
        print("\n✅ Database cleared successfully!")
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def backup_and_clear():
    """Create a backup before clearing the database."""
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return False
    
    try:
        # Create backup
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = f"resume_screener_backup_{timestamp}.db"
        
        conn = sqlite3.connect(DB_PATH)
        conn.execute("VACUUM;")
        
        # Copy database
        conn.backup(sqlite3.connect(backup_path))
        conn.close()
        
        print(f"✅ Backup created: {backup_path}")
        
        # Now clear the original
        clear_database()
        return True
        
    except Exception as e:
        print(f"❌ Error creating backup: {e}")
        return False


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--backup":
        backup_and_clear()
    else:
        clear_database()
