#!/usr/bin/env python3

from pathlib import Path
from json import load
from typing import Dict, List
from subprocess import run


def get_src_dir() -> Path:
    this_file = Path(__file__)
    return this_file.parent.parent


def read_lang_keys() -> List[str]:
    nb_lang_file = get_src_dir() / "frontend/assets/lang/nb.json"
    with open(nb_lang_file, "r") as nb_lang_open:
        nb_lang: Dict = load(nb_lang_open)
        return nb_lang.keys()


def find_key_usage(key: str) -> int:
    if "sivilstatus.kode" in key:
        return 1

    proc = run(
        ["grep", "-rch", "--exclude-dir=assets", key, get_src_dir() / "frontend"],
        capture_output=True,
        text=True,
    )
    hits = list(filter(None, proc.stdout.split("\n")))
    return sum([int(x) for x in hits])


for key in read_lang_keys():
    if find_key_usage(key) == 0:
        print(key)
