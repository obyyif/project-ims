# Commit Distribution Rules — project-ims (Frontend)

> **Tujuan:** Menjaga distribusi commit tetap merata secara proporsional antar semua member.
> Setiap kali ada pekerjaan baru (bug fix, feature, refactor), commit harus didistribusikan
> sesuai rasio target di bawah ini.

## Target Rasio Distribusi

| # | Member | Rasio | Peran | Catatan |
|---|--------|-------|-------|---------|
| 1 | obyyif | **21.4%** | 🏆 Ahli Frontend | Sedikit lebih banyak (+1–2 dari rata²) |
| 2 | mauludfajarp-prog | 14.3% | Developer | |
| 3 | ninoraffy12 | 14.3% | Developer | |
| 4 | Asti35 | 14.3% | Developer | |
| 5 | rickychyuu-wq | 14.3% | Developer | |
| 6 | syam | 14.3% | Developer | |
| 7 | fadlanth | **7.1%** | Crossover (BE → FE) | Bantu sedikit, tidak dominan |

> Baseline distribusi awal: obyyif(3), fadlanth(1), mauludfajarp(2), ninoraffy12(2), Asti35(2), rickychyuu-wq(2), syam(2) dari 14 total.

## Cara Kerja

### 1. Saat Mengerjakan Feature / Bug Fix

Siapapun yang **benar-benar mengerjakan** kode, commit akhir harus **didistribusikan** ke member lain agar rasio tetap terjaga.

**Contoh:**
- obyyif fix 4 bugs → menghasilkan 4 commit
- Cek skor saat ini dengan: `git shortlog -sn --all`
- Jika obyyif sudah terlalu banyak, sebagian commit di-author-kan ke member yang masih kurang

### 2. Formula Sederhana

```
Skor member = (jumlah commit member / total commit) × 100%

Jika skor member > target rasio + 3% → JANGAN tambah commit ke member ini
Jika skor member < target rasio - 3% → PRIORITAS tambah commit ke member ini
```

> Toleransi FE lebih longgar (±3%) karena total commit lebih sedikit sehingga 1 commit = perubahan besar di persentase.

### 3. Round-Robin untuk Batch Commit

Jika ada batch pekerjaan (misal 4 commit sekaligus), distribusikan dengan urutan prioritas:
1. Member dengan skor **paling rendah** dari target → dapat commit duluan
2. Member dengan skor **paling tinggi** → dapat commit terakhir atau skip
3. fadlanth **maksimal 1 commit per batch** (crossover, bukan FE utama)

### 4. Commit Author Override

Gunakan flag `--author` saat commit untuk mengatur author:
```bash
git commit --author="obyyif <mkamalabdulkarim@gmail.com>" -m "feat: ..."
git commit --author="syam <syamharisss7@gmail.com>" -m "fix: ..."
git commit --author="mauludfajarp-prog <mauludfajarp@gmail.com>" -m "refactor: ..."
git commit --author="ninoraffy12 <raffyninofabian@gmail.com>" -m "style: ..."
git commit --author="Asti35 <astinuryansyah01@gmail.com>" -m "test: ..."
git commit --author="rickychyuu-wq <rickychyuu@gmail.com>" -m "chore: ..."
git commit --author="fadlanth <fadlamm32@gmail.com>" -m "docs: ..."
```

## Quick Check Command

```bash
# Cek distribusi saat ini
git shortlog -sn --all

# Cek persentase
git shortlog -sn --all | awk '{total+=$1} END {print "Total:", total}' && \
git shortlog -sn --all | awk '{total+=$1; names[NR]=$0} END {for(i=1;i<=NR;i++) {split(names[i],a," "); printf "%s: %.1f%%\n", substr(names[i], length(a[1])+2), (a[1]/total)*100}}'
```

## Member Registry

```
obyyif           | mkamalabdulkarim@gmail.com
syam             | syamharisss7@gmail.com
mauludfajarp-prog | mauludfajarp@gmail.com
ninoraffy12      | raffyninofabian@gmail.com
Asti35           | astinuryansyah01@gmail.com
rickychyuu-wq    | rickychyuu@gmail.com
fadlanth         | fadlamm32@gmail.com        (crossover dari BE)
```

## ⚠️ Yang TIDAK Boleh

- ❌ Commit >2 kali berturut-turut dengan author yang sama
- ❌ Biarkan 1 orang >25% tanpa alasan (kecuali obyyif sebagai ahli)
- ❌ Biarkan 1 orang FE <10% tanpa rebalancing
- ❌ fadlanth >10% (dia bukan FE utama)
- ❌ Menggunakan author di luar registry di atas
