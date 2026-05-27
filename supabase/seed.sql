-- Seed laboratories (matches former JSON sample dataset)
insert into public.laboratories (
  id, name, city, province, longitude, latitude,
  biomarkers, assays, platform, utilization, tier, tat_days
) values
  ('bj-precision', 'Beijing Precision Diagnostics Center', 'Beijing', 'Beijing', 116.4074, 39.9042,
   array['EGFR','ALK','PD-L1'], array['NGS Panel','qPCR','IHC'], 'Illumina NovaSeq', 92, 'Tier 3A', 2),
  ('sh-translational', 'Shanghai Translational Genomics Lab', 'Shanghai', 'Shanghai', 121.4737, 31.2304,
   array['HER2','KRAS G12C','MET Exon 14'], array['NGS Panel','IHC','FISH'], 'Illumina NextSeq', 88, 'Tier 3A', 2),
  ('gz-molecular', 'Guangzhou Molecular Insight Institute', 'Guangzhou', 'Guangdong', 113.2644, 23.1291,
   array['EGFR','ROS1','BRAF V600E'], array['qPCR','ddPCR','RT-PCR'], 'Bio-Rad QX200', 84, 'Tier 2', 3),
  ('cd-oncology', 'Chengdu Oncology Companion Dx Hub', 'Chengdu', 'Sichuan', 104.0665, 30.5728,
   array['ALK','ROS1','PD-L1'], array['NGS Panel','FISH','Sanger Sequencing'], 'Thermo Fisher Ion Torrent', 81, 'Tier 2', 4),
  ('wh-central', 'Wuhan Central Molecular Diagnostics', 'Wuhan', 'Hubei', 114.3055, 30.5928,
   array['EGFR','KRAS G12C','PD-L1'], array['qPCR','IHC','RT-PCR'], 'Roche Cobas', 85, 'Tier 3', 3),
  ('nj-genome', 'Nanjing Genomic Medicine Laboratory', 'Nanjing', 'Jiangsu', 118.7969, 32.0603,
   array['HER2','MET Exon 14','BRAF V600E'], array['NGS Panel','ddPCR','IHC'], 'Illumina NovaSeq', 79, 'Tier 2', 4),
  ('hz-precision', 'Hangzhou Precision Pathology Center', 'Hangzhou', 'Zhejiang', 120.1551, 30.2741,
   array['EGFR','ALK','HER2'], array['IHC','FISH','NGS Panel'], 'Agilent Dako', 86, 'Tier 3', 2),
  ('jn-onco', 'Jinan Oncology Diagnostics Institute', 'Jinan', 'Shandong', 117.1205, 36.6519,
   array['KRAS G12C','PD-L1','ROS1'], array['RT-PCR','qPCR','Sanger Sequencing'], 'Roche Cobas', 77, 'Tier 2', 5)
on conflict (id) do update set
  name = excluded.name,
  city = excluded.city,
  province = excluded.province,
  longitude = excluded.longitude,
  latitude = excluded.latitude,
  biomarkers = excluded.biomarkers,
  assays = excluded.assays,
  platform = excluded.platform,
  utilization = excluded.utilization,
  tier = excluded.tier,
  tat_days = excluded.tat_days,
  updated_at = now();
