#!/usr/bin/env python3
"""
HMTI Fair 2026 - Silent Print Bridge Daemon
Memantau folder C:\Photobooth_PrintQueue dan mencetak otomatis ke printer default Windows.
"""

import os
import sys
import time
import json
import shutil
import subprocess
from datetime import datetime

QUEUE_DIR = r"C:\Photobooth_PrintQueue"
PRINTED_DIR = r"C:\Photobooth_Printed"
ARCHIVE_DIR = r"C:\Photobooth_Archive"

def setup_directories():
    for d in [QUEUE_DIR, PRINTED_DIR, ARCHIVE_DIR]:
        if not os.path.exists(d):
            os.makedirs(d, exist_ok=True)
            print(f"[INIT] Membuat folder: {d}")

def get_default_printer():
    try:
        cmd = 'powershell -NoProfile -Command "(Get-CimInstance Win32_Printer | Where-Object Default).Name"'
        result = subprocess.check_output(cmd, shell=True, text=True).strip()
        return result if result else "Default Windows Printer"
    except Exception:
        return "Default Windows Printer"

def print_image(file_path, copies=1):
    printer_name = get_default_printer()
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 🖨️  Mencetak ke: {printer_name}")
    print(f"      File   : {os.path.basename(file_path)}")
    print(f"      Jumlah : {copies} Lembar")

    for i in range(copies):
        print(f"      -> Mengirim lembar {i + 1}/{copies} ke spooler printer...")
        try:
            # Gunakan PowerShell verb Print untuk mengirim langsung ke printer default Windows
            ps_cmd = f'Start-Process -FilePath "{file_path}" -Verb Print -WindowStyle Hidden'
            subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], check=True)
            time.sleep(2)  # Jeda antar pengiriman spooler
        except Exception as e:
            print(f"      ❌ Gagal mencetak lembar {i + 1}: {e}")
            return False

    print("      ✅ Berhasil dikirim ke printer fisik!")
    return True

def process_queue():
    setup_directories()
    printer_name = get_default_printer()

    print("=" * 65)
    print("  📸 HMTI FAIR 2026 - SILENT PRINT BRIDGE DAEMON")
    print("=" * 65)
    print(f"  • Folder Antrean : {QUEUE_DIR}")
    print(f"  • Folder Selesai : {PRINTED_DIR}")
    print(f"  • Printer Aktif  : {printer_name}")
    print("=" * 65)
    print("Menunggu foto baru dari booth... (Tekan Ctrl + C untuk berhenti)\n")

    while True:
        try:
            files = [f for f in os.listdir(QUEUE_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            for file_name in files:
                file_path = os.path.join(QUEUE_DIR, file_name)
                base_name = os.path.splitext(file_name)[0]
                meta_path = os.path.join(QUEUE_DIR, base_name + '.json')

                # Cek metadata copies
                copies = 1
                if os.path.exists(meta_path):
                    try:
                        with open(meta_path, 'r', encoding='utf-8') as mf:
                            meta = json.load(mf)
                            copies = int(meta.get('copies', 1))
                    except Exception:
                        copies = 1

                # Beri sedikit waktu jika file masih ditulis oleh server
                time.sleep(0.5)

                success = print_image(file_path, copies=copies)

                if success:
                    # Pindahkan ke folder PRINTED_DIR
                    dest_img = os.path.join(PRINTED_DIR, file_name)
                    if os.path.exists(dest_img):
                        os.remove(dest_img)
                    shutil.move(file_path, dest_img)

                    if os.path.exists(meta_path):
                        dest_meta = os.path.join(PRINTED_DIR, os.path.basename(meta_path))
                        if os.path.exists(dest_meta):
                            os.remove(dest_meta)
                        shutil.move(meta_path, dest_meta)

            time.sleep(1)
        except KeyboardInterrupt:
            print("\n[STOP] Print Bridge dimatikan oleh operator.")
            break
        except Exception as err:
            print(f"[ERROR] {err}")
            time.sleep(2)

if __name__ == '__main__':
    process_queue()
