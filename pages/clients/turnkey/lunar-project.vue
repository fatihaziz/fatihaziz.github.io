<template>
  <div class="lunar-root">
    <!-- starfield backdrop -->
    <div class="stars" aria-hidden="true"></div>

    <header class="masthead">
      <div class="mast-left">
        <span class="sigil">( )</span>
        <div>
          <p class="eyebrow">fatihaziz.com / clients / turnkey</p>
          <h1>LUNAR<span class="thin">TRACKER</span></h1>
          <p class="sub">PrimeCodex Broker CRM - progress, bola, sprint points, feedback</p>
        </div>
      </div>
      <div class="mast-right">
        <div v-if="state" class="countdown">
          <span class="cd-num">{{ daysToTrial }}</span>
          <span class="cd-label">hari ke user trial<br />27 JUL 2026</span>
        </div>
        <div class="auth-box">
          <template v-if="me">
            <span class="chip" :data-ball="me.role === 'dev' ? 'dev' : 'product'" style="cursor: default">
              {{ me.username }} ({{ me.role }})
            </span>
            <button class="btn ghost" @click="logout">keluar</button>
          </template>
          <form v-else class="auth-form" @submit.prevent="login">
            <input v-model="loginForm.username" class="inp w8" placeholder="username" autocomplete="username" required />
            <input v-model="loginForm.key" class="inp w8" type="password" placeholder="access key" required />
            <button class="btn ghost" :disabled="busy">masuk</button>
          </form>
          <p v-if="loginError" class="dim small err">{{ loginError }}</p>
        </div>
      </div>
    </header>

    <main v-if="state">
      <!-- ============ THE BALL ============ -->
      <section class="ball-court" aria-label="Posisi bola">
        <div class="court" :class="{ 'at-product': ball.holder === 'product' }">
          <div class="court-side" :class="{ active: ball.holder === 'dev' }">
            <span class="court-tag">DEVELOPER</span>
            <span class="court-name">Fatih</span>
          </div>
          <div class="net" aria-hidden="true"></div>
          <div class="court-side right" :class="{ active: ball.holder === 'product' }">
            <span class="court-tag">TIM PRODUCT</span>
            <span class="court-name">Nana + team</span>
          </div>
          <div class="orb-lane" aria-hidden="true">
            <div class="orb">
              <div class="orb-ring"></div>
            </div>
          </div>
        </div>
        <div class="ball-meta">
          <p class="ball-line">
            Bola di
            <strong>{{ ball.holder === 'dev' ? 'DEVELOPER' : 'TIM PRODUCT' }}</strong>
            <span v-if="ball.since" class="dim"> - sejak {{ fmtDate(ball.since) }}</span>
          </p>
          <p v-if="ball.note" class="ball-note">"{{ ball.note }}"</p>
          <p class="dim small">
            Bola di TIM PRODUCT = developer sudah serah terima dan menunggu feedback kalian
            (notif masuk ke Telegram).
          </p>
          <div v-if="me" class="ball-actions">
            <button class="btn" :disabled="busy" @click="handover(ball.holder === 'dev' ? 'product' : 'dev')">
              {{ ball.holder === 'dev' ? 'Serahkan bola ke TIM PRODUCT ->' : '<- Tarik bola ke DEVELOPER' }}
            </button>
            <input v-model="handoverNote" class="inp" placeholder="catatan serah terima (opsional)" />
          </div>
          <p v-else class="dim small">Login untuk pindahkan bola / menulis di board ini.</p>
        </div>
      </section>

      <!-- ============ SPRINT POINTS ============ -->
      <section class="stats" aria-label="Sprint points">
        <div class="stat">
          <span class="stat-num">{{ spProgress.done }}<span class="of">/{{ spProgress.total }}</span></span>
          <span class="stat-label">Scope selesai (estimasi)</span>
          <div class="bar"><div class="bar-fill" :style="{ width: pct(spProgress.done, spProgress.total) }"></div></div>
          <span class="dim small">total scope {{ spProgress.total }} SP = {{ toDays(spProgress.total) }} hari kerja tim normal</span>
        </div>
        <div class="stat">
          <span class="stat-num" :class="{ under: daysSaved.saved > 0, over: daysSaved.saved < 0 }">
            {{ daysSaved.saved > 0 ? '+' : '' }}{{ daysSaved.saved }}<span class="of"> hari</span>
          </span>
          <span class="stat-label">Hemat waktu sejak {{ daysSaved.since }}</span>
          <span class="dim small">
            scope selesai {{ daysSaved.est }} SP = {{ daysSaved.planned }} hari kerja tim normal @ {{ spDay }} SP/hari,
            dikerjakan {{ daysSaved.elapsed }} hari
          </span>
          <label v-if="isDev" class="dim small maxday">
            SP/hari tim normal:
            <input
              class="inp tiny"
              type="number"
              min="0.5"
              max="40"
              step="0.5"
              :value="state.sprint.spPerDay"
              @change="saveSpPerDay(($event.target as HTMLInputElement).value)"
            />
          </label>
        </div>
        <div class="stat">
          <span class="stat-num">{{ remaining.sp }}<span class="of"> SP</span></span>
          <span class="stat-label">Sisa scope</span>
          <span class="dim small">= {{ remaining.days }} hari kerja tim normal</span>
          <span v-if="remaining.eta > 0" class="dim small">
            pace dev sekarang {{ remaining.pace }} SP/hari -> sekitar {{ remaining.eta }} hari lagi
          </span>
        </div>
        <div class="stat">
          <span class="stat-num">{{ state.sprint.spentSprint }}</span>
          <span class="stat-label">Effort dev (worklog)</span>
          <span class="dim small">
            {{ state.sprint.start }} -> {{ state.sprint.end }} = {{ wlBreakdown.days }} hari kerja tim normal
          </span>
          <span class="dim small">
            = {{ wlBreakdown.scope }} sesuai estimasi + {{ wlBreakdown.overrun }} overrun{{
              wlBreakdown.inflight ? ` + ${wlBreakdown.inflight} task berjalan` : ''
            }}{{ wlBreakdown.other ? ` + ${wlBreakdown.other} lainnya` : '' }}
          </span>
        </div>
        <div class="stat burn">
          <span class="stat-label">Burn 7 hari (SP/worklog)</span>
          <div class="burn-bars">
            <div v-for="b in state.sprint.burn7" :key="b.day" class="burn-col" :title="`${b.day}: ${b.points} SP`">
              <div class="burn-bar" :style="{ height: burnHeight(b.points) }"></div>
              <span class="burn-day">{{ b.day.slice(8) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ FEATURE COVERAGE ============ -->
      <section aria-label="Feature coverage">
        <div class="sec-head">
          <h2>Feature coverage</h2>
          <p class="dim">
            {{ state.coverage.issuesDone }}/{{ state.coverage.issuesTotal }} issues roadmap ({{ coveragePct }}%)
            - trial 27 Jul: {{ state.coverage.trialDone }}/{{ state.coverage.trialTotal }} workstream done
          </p>
        </div>
        <div class="cov-total bar big"><div class="bar-fill" :style="{ width: coveragePct + '%' }"></div></div>

        <h3 class="grp">Trial 27 Jul (jalur kritis)</h3>
        <div class="cov-grid">
          <article v-for="f in trialFeatures" :key="f.id" class="cov-card" :data-status="f.status">
            <header>
              <span class="cov-code">{{ f.code.replace('TRIAL-', '') }}</span>
              <span>
                <button class="chip" :data-status="f.status" :disabled="!isDev" @click="isDev && cycleFeatureStatus(f)">{{ f.status }}</button>
                <button v-if="isDev" class="mini del" title="hapus target" @click="removeFeature(f)">x</button>
              </span>
            </header>
            <p class="cov-title">{{ f.title }}</p>
          </article>
        </div>

        <h3 class="grp">Roadmap milestones (scope trial 27 Jul)</h3>
        <div class="cov-grid milestones">
          <article v-for="f in milestoneFeatures" :key="f.id" class="cov-card" :data-status="f.status">
            <header>
              <span class="cov-code">{{ f.code }}</span>
              <span class="cov-count">{{ f.issues_done }}/{{ f.issues_total }}</span>
            </header>
            <p class="cov-title">{{ f.title }}</p>
            <div class="bar"><div class="bar-fill" :style="{ width: pct(f.issues_done, f.issues_total) }"></div></div>
            <div class="cov-edit">
              <button class="chip ball-chip" :data-ball="f.ball" :disabled="!me" :title="me ? 'klik utk pindah bola card ini' : 'login dulu'" @click="me && flipFeatureBall(f)">
                bola: {{ f.ball === 'product' ? 'PRODUCT' : 'DEV' }}
              </button>
              <button class="chip" @click="openFeature = f">detail ({{ subtasksFor(f.id).length }})</button>
              <template v-if="isDev">
                <button class="mini" @click="bumpFeature(f, -1)">-</button>
                <button class="mini" @click="bumpFeature(f, +1)">+</button>
                <button class="chip" :data-status="f.status" @click="cycleFeatureStatus(f)">{{ f.status }}</button>
                <button class="mini del" title="hapus target" @click="removeFeature(f)">x</button>
              </template>
            </div>
          </article>
        </div>
      </section>

      <!-- ============ TASKS ============ -->
      <section aria-label="Tasks">
        <div class="sec-head">
          <h2>Tasks &amp; bugfix</h2>
          <p class="dim">
            {{ taskProgress.done }}/{{ taskProgress.total }} task selesai ({{ pct(taskProgress.done, taskProgress.total) }})
            - tiap task punya deadline, sprint point + bola sendiri.
          </p>
        </div>
        <div class="bar big"><div class="bar-fill" :style="{ width: pct(taskProgress.done, taskProgress.total) }"></div></div>

        <form v-if="me" class="add-form" @submit.prevent="addTask">
          <label class="field grow"><span class="f-label">Judul</span>
            <input v-model="newTask.title" class="inp" placeholder="Judul task / bug..." required /></label>
          <label class="field"><span class="f-label">Tipe</span>
            <LunarSelect v-model="newTask.type" class="w8sel" :options="TASK_TYPE_OPTS" /></label>
          <label class="field"><span class="f-label">Area</span>
            <input v-model="newTask.area" class="inp w8" placeholder="KYC..." /></label>
          <label class="field"><span class="f-label">SP</span>
            <input v-model.number="newTask.points" class="inp tiny" type="number" min="0" max="13" /></label>
          <label class="field"><span class="f-label">Deadline</span>
            <input v-model="newTask.due" class="inp date" type="date" /></label>
          <button class="btn" :disabled="busy">+ Tambah</button>
        </form>
        <textarea
          v-if="me"
          v-model="newTask.detail"
          class="inp area"
          rows="2"
          placeholder="Detail / acceptance criteria (opsional)"
        ></textarea>
        <p v-else class="dim small">Login untuk menambah task.</p>

        <nav class="tabs" role="tablist">
          <button class="tab" :class="{ on: taskTab === 'aktif' }" @click="taskTab = 'aktif'">
            Aktif ({{ taskGroups.aktif.length }})
          </button>
          <button class="tab" :class="{ on: taskTab === 'selesai' }" @click="taskTab = 'selesai'">
            Selesai ({{ taskGroups.selesai.length }})
          </button>
          <button class="tab" :class="{ on: taskTab === 'arsip' }" @click="taskTab = 'arsip'">
            Arsip ({{ taskGroups.arsip.length }})
          </button>
        </nav>

        <ul class="task-list">
          <li
            v-for="t in visibleTasks"
            :key="t.id"
            class="task"
            :data-status="t.status"
            :class="{ 'overdue-card': isOverdue(t) }"
          >
            <form v-if="editTaskId === t.id" class="edit-form" @submit.prevent="saveEditTask(t)">
              <label class="field grow"><span class="f-label">Judul</span>
                <input v-model="editDraft.title" class="inp" required /></label>
              <label class="field"><span class="f-label">Area</span>
                <input v-model="editDraft.area" class="inp w8" /></label>
              <label class="field"><span class="f-label">SP</span>
                <input v-model.number="editDraft.points" class="inp tiny" type="number" min="0" max="13" /></label>
              <label class="field"><span class="f-label">Deadline</span>
                <input v-model="editDraft.due" class="inp date" type="date" /></label>
              <label class="field wide"><span class="f-label">Detail</span>
                <textarea v-model="editDraft.detail" class="inp area" rows="3"></textarea></label>
              <div class="edit-actions">
                <button class="btn" :disabled="busy">Simpan</button>
                <button class="btn ghost" type="button" @click="editTaskId = null">Batal</button>
              </div>
            </form>
            <template v-else>
              <div class="task-main">
                <span class="type-tag" :data-type="t.type">{{ t.type === 'bugfix' ? 'BUG' : 'TASK' }}</span>
                <div class="task-body">
                  <p class="task-title">
                    {{ t.title }}
                    <span v-if="isOverdue(t)" class="chip sev" data-sev="critical">TELAT</span>
                  </p>
                  <p
                    v-if="t.detail"
                    class="dim small detail"
                    :class="{ clamp: t.detail.length > 160 && !expanded[t.id] }"
                  >{{ t.detail }}</p>
                  <button
                    v-if="t.detail && t.detail.length > 160"
                    class="toggle-link"
                    type="button"
                    @click="expanded[t.id] = !expanded[t.id]"
                  >{{ expanded[t.id] ? 'sembunyikan' : 'selengkapnya...' }}</button>
                  <p class="meta-line">
                    <span class="meta-badge">{{ t.area || 'general' }}</span>
                    <span class="meta-badge">oleh {{ t.created_by || '?' }}</span>
                    <span class="meta-badge date">dibuat {{ fmtDate(t.created_at) }}</span>
                    <span v-if="t.due" class="meta-badge date" :class="isOverdue(t) ? 'bad' : 'warn'">deadline {{ t.due }}</span>
                    <span v-if="t.status === 'done' && t.done_at" class="meta-badge date good">selesai {{ fmtDate(t.done_at) }}</span>
                  </p>
                </div>
              </div>
              <div class="task-ctrl">
                <div class="ctl">
                  <span class="ctl-label">SP</span>
                  <span v-if="t.status === 'cancelled'" class="sp dim">batal</span>
                  <span v-else class="sp" :title="`estimasi ${t.points} SP - actual ${t.logged_points} SP`">
                    {{ t.logged_points }}/{{ t.points }}
                  </span>
                </div>
                <div v-if="me && taskTab === 'aktif'" class="ctl">
                  <span class="ctl-label">Deadline</span>
                  <input
                    class="inp date"
                    type="date"
                    :value="t.due"
                    @change="setTaskDue(t, ($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div v-if="isDev && taskTab === 'aktif'" class="ctl">
                  <span class="ctl-label">Log SP hari ini</span>
                  <span class="ctl-row">
                    <input v-model.number="logDraft[t.id]" class="inp tiny" type="number" min="0.5" max="13" step="0.5" placeholder="SP" />
                    <button class="mini" title="log worklog hari ini" @click="logWork(t)">+</button>
                  </span>
                </div>
                <div class="ctl">
                  <span class="ctl-label">Bola</span>
                  <button
                    class="chip ball-chip"
                    :data-ball="t.ball"
                    :disabled="!me"
                    :title="t.ball === 'dev' ? 'bola di developer - klik utk serahkan ke product' : 'bola di tim product - klik utk tarik balik'"
                    @click="me && flipTaskBall(t)"
                  >{{ t.ball === 'dev' ? 'DEV' : 'PRODUCT' }}</button>
                </div>
                <div class="ctl">
                  <span class="ctl-label">Status</span>
                  <LunarSelect
                    class="w10sel"
                    :model-value="t.status"
                    :options="TASK_STATUS_OPTS"
                    :disabled="!me"
                    @update:model-value="(v) => setTaskStatus(t, String(v))"
                  />
                </div>
                <div v-if="me" class="ctl">
                  <span class="ctl-label">Aksi</span>
                  <span class="ctl-row">
                    <button class="act" title="edit task" @click="startEditTask(t)">edit</button>
                    <button v-if="!t.archived" class="act danger" title="hapus (soft) - bisa dipulihkan dari Arsip" @click="archiveTask(t, true)">hapus</button>
                    <button v-else class="act" title="pulihkan dari arsip" @click="archiveTask(t, false)">pulihkan</button>
                  </span>
                </div>
              </div>
            </template>
          </li>
          <li v-if="!visibleTasks.length" class="dim small empty">
            {{ taskTab === 'aktif' ? 'Tidak ada task aktif.' : taskTab === 'selesai' ? 'Belum ada yang selesai.' : 'Arsip kosong.' }}
          </li>
        </ul>
      </section>

      <!-- ============ FEEDBACK ============ -->
      <section aria-label="Feedback reports">
        <div class="sec-head">
          <h2>Feedback reports</h2>
          <p class="dim">
            {{ fbProgress.done }}/{{ fbProgress.total }} feedback resolved ({{ pct(fbProgress.done, fbProgress.total) }})
            - laporan hasil test / UAT dari tim. Feedback baru = notif Telegram ke developer.
          </p>
        </div>
        <div class="bar big"><div class="bar-fill alt" :style="{ width: pct(fbProgress.done, fbProgress.total) }"></div></div>
        <form v-if="me" class="add-form" @submit.prevent="addFeedback">
          <LunarSelect
            v-model="newFb.featureId"
            class="featsel"
            :options="featureOptions"
            placeholder="pilih roadmap card *"
          />
          <LunarSelect v-model="newFb.severity" class="w8sel" :options="SEVERITY_OPTS" />
          <input v-model="newFb.body" class="inp grow" placeholder="SATU error per report (repro, halaman, expected vs actual)" required />
          <input v-model="newFb.link" class="inp w8" placeholder="link gdocs (ops.)" />
          <input ref="fbFile" class="inp file" type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,video/mp4,video/webm" title="boleh banyak file: gambar/pdf/video, maks 25MB per file" />
          <button class="btn" :disabled="busy">Kirim feedback</button>
        </form>
        <p v-else class="dim small">Login untuk kirim feedback.</p>
        <nav class="tabs" role="tablist">
          <button class="tab" :class="{ on: fbTab === 'aktif' }" @click="fbTab = 'aktif'">Open ({{ fbGroups.aktif.length }})</button>
          <button class="tab" :class="{ on: fbTab === 'resolved' }" @click="fbTab = 'resolved'">Resolved ({{ fbGroups.resolved.length }})</button>
          <button class="tab" :class="{ on: fbTab === 'arsip' }" @click="fbTab = 'arsip'">Arsip ({{ fbGroups.arsip.length }})</button>
        </nav>
        <ul class="fb-list">
          <li v-for="f in visibleFeedback" :key="f.id" class="fb" :data-status="f.status">
            <span class="chip sev" :data-sev="f.severity">{{ f.severity }}</span>
            <div class="fb-body">
              <form v-if="editFbId === f.id" class="edit-form" @submit.prevent="saveEditFb(f)">
                <label class="field wide"><span class="f-label">Feedback</span>
                  <textarea v-model="editFbDraft.body" class="inp area" rows="2" required></textarea></label>
                <div class="field wide">
                  <span class="f-label">File terlampir</span>
                  <span class="ctl-row wrap">
                    <span v-for="(att, i) in editFbDraft.attachments" :key="att" class="chip link-chip">
                      {{ isImg(att) ? `gambar ${i + 1}` : attLabel(att, i) }}
                      <button class="chip-x" type="button" title="hapus file ini" @click="editFbDraft.attachments.splice(i, 1)">x</button>
                    </span>
                    <input ref="editFbFile" class="inp file" type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,video/mp4,video/webm" title="tambah file baru" />
                  </span>
                </div>
                <label class="field grow"><span class="f-label">Link</span>
                  <input v-model="editFbDraft.link" class="inp" placeholder="https://..." /></label>
                <div class="edit-actions">
                  <button class="btn" :disabled="busy">Simpan</button>
                  <button class="btn ghost" type="button" @click="editFbId = null">Batal</button>
                </div>
              </form>
              <template v-else>
                <p><span v-if="f.feature_id" class="cov-code">{{ featureCode(f.feature_id) }}</span> {{ f.body }}</p>
                <p class="meta-line">
                  <span class="meta-badge">{{ f.author || 'anon' }}</span>
                  <span class="meta-badge date">{{ fmtDate(f.created_at) }}</span>
                  <a v-if="f.link" class="chip link-chip" :href="f.link" target="_blank" rel="noopener">buka link</a>
                  <template v-for="(att, i) in attList(f.attachment)" :key="att">
                    <a v-if="!isImg(att)" class="chip link-chip" :href="API + att" target="_blank" rel="noopener">{{ attLabel(att, i) }}</a>
                  </template>
                </p>
                <div v-if="attList(f.attachment).some(isImg)" class="att-gallery">
                  <a v-for="att in attList(f.attachment).filter(isImg)" :key="att" :href="API + att" target="_blank" rel="noopener">
                    <img class="fb-img" :src="API + att" alt="lampiran feedback" loading="lazy" />
                  </a>
                </div>
              </template>
            </div>
            <div class="ctl">
              <span class="ctl-label">Status</span>
              <LunarSelect
                class="w10sel"
                :model-value="f.status"
                :options="FB_STATUS_OPTS"
                :disabled="!isDev"
                @update:model-value="(v) => setFeedbackStatus(f, String(v))"
              />
            </div>
            <div v-if="me" class="ctl">
              <span class="ctl-label">Aksi</span>
              <span class="ctl-row">
                <button class="act" title="edit feedback" @click="startEditFb(f)">edit</button>
                <button v-if="!f.archived" class="act danger" title="hapus (soft)" @click="archiveFeedback(f, true)">hapus</button>
                <button v-else class="act" title="pulihkan" @click="archiveFeedback(f, false)">pulihkan</button>
              </span>
            </div>
          </li>
          <li v-if="!visibleFeedback.length" class="dim small empty">
            {{ fbTab === 'arsip' ? 'Arsip kosong.' : fbTab === 'resolved' ? 'Belum ada yang resolved.' : 'Belum ada feedback open. Test lalu laporkan di sini.' }}
          </li>
        </ul>
      </section>

      <!-- ============ QUESTIONS ============ -->
      <section aria-label="Questions">
        <div class="sec-head">
          <h2>Questions</h2>
          <p class="dim">Pertanyaan tim ke developer, terpisah dari feedback. Wajib pilih roadmap card.</p>
        </div>
        <form v-if="me" class="add-form" @submit.prevent="addQuestion">
          <LunarSelect
            v-model="newQ.featureId"
            class="featsel"
            :options="featureOptions"
            placeholder="pilih roadmap card *"
          />
          <input v-model="newQ.question" class="inp grow" placeholder="Pertanyaan kamu..." required />
          <input ref="qFile" class="inp file" type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,video/mp4,video/webm" title="boleh banyak file: gambar/pdf/video, maks 25MB per file" />
          <button class="btn" :disabled="busy">Tanya</button>
        </form>
        <p v-else class="dim small">Login untuk bertanya.</p>
        <nav class="tabs" role="tablist">
          <button class="tab" :class="{ on: qTab === 'open' }" @click="qTab = 'open'">Open ({{ qGroups.open.length }})</button>
          <button class="tab" :class="{ on: qTab === 'answered' }" @click="qTab = 'answered'">Terjawab ({{ qGroups.answered.length }})</button>
          <button class="tab" :class="{ on: qTab === 'arsip' }" @click="qTab = 'arsip'">Arsip ({{ qGroups.arsip.length }})</button>
        </nav>
        <ul class="fb-list">
          <li v-for="q in visibleQuestions" :key="q.id" class="fb" :data-status="q.status === 'answered' ? 'resolved' : 'open'">
            <span class="chip" :data-status="q.status === 'answered' ? 'done' : 'building'">{{ q.status }}</span>
            <div class="fb-body">
              <form v-if="editQId === q.id" class="edit-form" @submit.prevent="saveEditQ(q)">
                <label class="field wide"><span class="f-label">Pertanyaan</span>
                  <textarea v-model="editQDraft.question" class="inp area" rows="2" required></textarea></label>
                <div class="field wide">
                  <span class="f-label">File terlampir</span>
                  <span class="ctl-row wrap">
                    <span v-for="(att, i) in editQDraft.attachments" :key="att" class="chip link-chip">
                      {{ isImg(att) ? `gambar ${i + 1}` : attLabel(att, i) }}
                      <button class="chip-x" type="button" title="hapus file ini" @click="editQDraft.attachments.splice(i, 1)">x</button>
                    </span>
                    <input ref="editQFile" class="inp file" type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,video/mp4,video/webm" title="tambah file baru" />
                  </span>
                </div>
                <div class="edit-actions">
                  <button class="btn" :disabled="busy">Simpan</button>
                  <button class="btn ghost" type="button" @click="editQId = null">Batal</button>
                </div>
              </form>
              <template v-else>
                <p><span class="cov-code">{{ featureCode(q.feature_id) }}</span> {{ q.question }}</p>
                <p class="meta-line">
                  <span class="meta-badge">{{ q.author }}</span>
                  <span class="meta-badge date">{{ fmtDate(q.created_at) }}</span>
                  <template v-for="(att, i) in attList(q.attachment)" :key="att">
                    <a v-if="!isImg(att)" class="chip link-chip" :href="API + att" target="_blank" rel="noopener">{{ attLabel(att, i) }}</a>
                  </template>
                </p>
                <div v-if="attList(q.attachment).some(isImg)" class="att-gallery">
                  <a v-for="att in attList(q.attachment).filter(isImg)" :key="att" :href="API + att" target="_blank" rel="noopener">
                    <img class="fb-img" :src="API + att" alt="lampiran pertanyaan" loading="lazy" />
                  </a>
                </div>
                <p v-if="q.answer" class="q-answer">{{ q.answer }} <span class="dim small">- {{ q.answered_by }}, {{ fmtDate(q.answered_at || '') }}</span></p>
                <form v-else-if="isDev" class="add-form" @submit.prevent="answerQuestion(q)">
                  <input v-model="answerDraft[q.id]" class="inp grow" placeholder="Jawab inline..." required />
                  <button class="btn ghost" :disabled="busy">Jawab</button>
                </form>
              </template>
            </div>
            <div v-if="me" class="ctl">
              <span class="ctl-label">Aksi</span>
              <span class="ctl-row">
                <button class="act" title="edit pertanyaan" @click="startEditQ(q)">edit</button>
                <button v-if="!q.archived" class="act danger" title="hapus (soft)" @click="archiveQuestion(q, true)">hapus</button>
                <button v-else class="act" title="pulihkan" @click="archiveQuestion(q, false)">pulihkan</button>
              </span>
            </div>
          </li>
          <li v-if="!visibleQuestions.length" class="dim small empty">
            {{ qTab === 'arsip' ? 'Arsip kosong.' : qTab === 'answered' ? 'Belum ada yang terjawab.' : 'Belum ada pertanyaan open.' }}
          </li>
        </ul>
      </section>

      <!-- ============ ACTIVITY ============ -->
      <section aria-label="Commits dan issues">
        <div class="sec-head">
          <h2>Commits & GitHub issues</h2>
          <div class="sec-actions">
            <button class="btn ghost" :disabled="busy" @click="syncGithub">Sync GitHub</button>
          </div>
        </div>
        <p v-if="syncMsg" class="dim small">{{ syncMsg }}</p>
        <table class="act-table">
          <thead>
            <tr><th>Jenis</th><th>Ref</th><th>Judul</th><th>Status</th><th>Oleh</th><th>Waktu</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in state.activity" :key="a.kind + a.ref">
              <td><span class="type-tag" :data-type="a.kind">{{ a.kind }}</span></td>
              <td class="mono">
                <a v-if="a.url" :href="a.url" target="_blank" rel="noopener">{{ a.ref }}</a>
                <template v-else>{{ a.ref }}</template>
              </td>
              <td>{{ a.title }}</td>
              <td><span class="chip" :data-status="a.state === 'done' ? 'done' : 'building'">{{ a.state }}</span></td>
              <td class="dim">{{ a.author }}</td>
              <td class="dim mono small">{{ fmtDate(a.happened_at) }}</td>
            </tr>
            <tr v-if="!state.activity.length">
              <td colspan="6" class="dim small empty">Belum ada activity - klik Sync GitHub atau tambah manual via API.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer class="foot dim small">
        LUNAR tracker - scope: target user trial 27 Jul. Data tersimpan di server;
        semua perubahan tim langsung kelihatan di sini.
      </footer>

      <!-- ============ ROADMAP CARD MODAL ============ -->
      <div v-if="openFeature" class="modal-back" @click.self="openFeature = null">
        <div class="modal" role="dialog" aria-modal="true" :aria-label="`Detail ${openFeature.code}`">
          <header class="modal-head">
            <div>
              <span class="cov-code">{{ openFeature.code }}</span>
              <h2>{{ openFeature.title }}</h2>
              <p class="dim small">
                {{ openFeature.issues_done }}/{{ openFeature.issues_total }} issues - due {{ openFeature.due }} -
                bola card di <strong>{{ openFeature.ball === 'product' ? 'TIM PRODUCT' : 'DEVELOPER' }}</strong>
              </p>
            </div>
            <button class="mini del" title="tutup" @click="openFeature = null">x</button>
          </header>
          <ul class="sub-list">
            <li v-for="s in subtasksFor(openFeature.id)" :key="s.id" class="sub">
              <button
                class="chip"
                :data-status="s.status === 'done' ? 'done' : s.status === 'doing' ? 'building' : undefined"
                :disabled="!isDev"
                @click="isDev && cycleSubtask(s)"
              >{{ s.status }}</button>
              <span class="sub-title">{{ s.title }}</span>
              <a
                v-if="s.issue_ref"
                class="mono small"
                :href="`https://github.com/turnkey-devs/lunar-crm-project/issues/${s.issue_ref.replace('#', '')}`"
                target="_blank"
                rel="noopener"
              >{{ s.issue_ref }}</a>
            </li>
            <li v-if="!subtasksFor(openFeature.id).length" class="dim small empty">Belum ada sub-task di card ini.</li>
          </ul>
          <form v-if="isDev" class="add-form" @submit.prevent="addSubtask">
            <input v-model="newSub.title" class="inp grow" placeholder="Sub-task baru..." required />
            <input v-model="newSub.issueRef" class="inp tiny" placeholder="#123" />
            <button class="btn ghost" :disabled="busy">+ Sub-task</button>
          </form>
        </div>
      </div>
    </main>

    <main v-else class="loading">
      <div class="orb small-orb"><div class="orb-ring"></div></div>
      <p class="dim">memuat data misi...</p>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  id: number; code: string; group_name: string; title: string; status: string
  issues_done: number; issues_total: number; due: string; sort: number; ball: string
}
interface Task {
  id: number; title: string; detail: string; type: string; points: number
  status: string; ball: string; area: string; created_by: string
  created_at: string; updated_at: string; done_at: string | null; due: string; archived: number; logged_points: number
}
interface Feedback {
  id: number; task_id: number | null; feature_id: number | null; author: string
  severity: string; body: string; link: string; attachment: string; status: string
  created_at: string; updated_at: string; archived: number
}
interface Subtask {
  id: number; feature_id: number; title: string; status: string; issue_ref: string
  points: number; sort: number
}
interface Question {
  id: number; feature_id: number; author: string; question: string; answer: string
  answered_by: string; attachment: string; status: string; created_at: string
  answered_at: string | null; archived: number
}
interface Activity {
  id: number; kind: string; ref: string; title: string; state: string
  author: string; url: string; happened_at: string
}
interface LunarState {
  ball: { holder: string; note: string; since: string }
  sprint: {
    start: string; end: string; maxPerDay: number; spentToday: number
    availableToday: number; spentSprint: number; inFlight: number
    estimateOpen: number; savingsSince: string; spPerDay: number; burn7: Array<{ day: string; points: number }>
  }
  coverage: { issuesDone: number; issuesTotal: number; trialDone: number; trialTotal: number }
  features: Feature[]; subtasks: Subtask[]; tasks: Task[]; feedback: Feedback[]
  questions: Question[]; activity: Activity[]
  worklog: Array<{ id: number; task_id: number; user: string; points: number; spent_on: string; note: string; auto: number }>
}
interface Me { username: string; role: string }

useHead({
  title: 'LUNAR Tracker - PrimeCodex CRM progress',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap',
    },
  ],
})

// Static gh-pages build talks to the Fly-hosted API cross-origin; on Fly/dev
// the base is empty (same origin).
const API = useRuntimeConfig().public.lunarApiBase

const state = ref<LunarState | null>(null)
const busy = ref(false)
const syncMsg = ref('')
const handoverNote = ref('')
const openFeature = ref<Feature | null>(null)
const newTask = reactive({ title: '', detail: '', type: 'task', points: 1, area: '', due: '' })
const newFb = reactive({ featureId: 0, severity: 'note', body: '', link: '' })
const newQ = reactive({ featureId: 0, question: '' })
const newSub = reactive({ title: '', issueRef: '' })
const logDraft = reactive<Record<number, number>>({})
const answerDraft = reactive<Record<number, string>>({})
const fbFile = ref<HTMLInputElement | null>(null)
const qFile = ref<HTMLInputElement | null>(null)

// --- tasks UX: tabs, inline edit, soft delete, detail clamp ---------------
const taskTab = ref<'aktif' | 'selesai' | 'arsip'>('aktif')
const expanded = reactive<Record<number, boolean>>({})
const editTaskId = ref<number | null>(null)
const editDraft = reactive({ title: '', detail: '', area: '', points: 1, due: '' })
const editFbId = ref<number | null>(null)
const editFbDraft = reactive({ body: '', link: '', attachments: [] as string[] })
const editQId = ref<number | null>(null)
const editQDraft = reactive({ question: '', attachments: [] as string[] })
const fbTab = ref<'aktif' | 'resolved' | 'arsip'>('aktif')
const qTab = ref<'open' | 'answered' | 'arsip'>('open')
const editFbFile = ref<HTMLInputElement | null>(null)
const editQFile = ref<HTMLInputElement | null>(null)

// --- auth (phase 1): Bearer session token, persisted in localStorage --------
const AUTH_KEY = 'lunar-auth'
const me = ref<Me | null>(null)
const token = ref('')
const loginForm = reactive({ username: '', key: '' })
const loginError = ref('')

function authHeaders(): Record<string, string> {
  return token.value ? { authorization: `Bearer ${token.value}` } : {}
}

async function login() {
  busy.value = true
  loginError.value = ''
  try {
    const r = await $fetch<{ token: string; user: Me }>(`${API}/api/lunar/auth/login`, {
      method: 'POST',
      body: { username: loginForm.username, key: loginForm.key },
    })
    token.value = r.token
    me.value = r.user
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: r.token, user: r.user }))
    loginForm.key = ''
  } catch {
    loginError.value = 'Username atau access key salah'
  } finally {
    busy.value = false
  }
}

async function logout() {
  $fetch(`${API}/api/lunar/auth/logout`, { method: 'POST', headers: authHeaders() }).catch(() => {})
  token.value = ''
  me.value = null
  localStorage.removeItem(AUTH_KEY)
}

async function restoreAuth() {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return
  try {
    const saved = JSON.parse(raw) as { token: string; user: Me }
    token.value = saved.token
    const r = await $fetch<{ user: Me | null }>(`${API}/api/lunar/auth/me`, { headers: authHeaders() })
    if (r.user) me.value = r.user
    else {
      token.value = ''
      localStorage.removeItem(AUTH_KEY)
    }
  } catch {
    token.value = ''
  }
}

const isDev = computed(() => me.value?.role === 'dev')
const ball = computed(() => state.value?.ball ?? { holder: 'dev', note: '', since: '' })
const trialFeatures = computed(() => state.value?.features.filter((f) => f.group_name === 'trial') ?? [])
const milestoneFeatures = computed(() => state.value?.features.filter((f) => f.group_name === 'milestone') ?? [])
const coveragePct = computed(() => {
  const c = state.value?.coverage
  return c && c.issuesTotal ? Math.round((c.issuesDone / c.issuesTotal) * 100) : 0
})
// SP accounting for the progress cards. Cancelled + archived tasks leave every
// figure, mirroring the server's SP math.
const liveTasks = computed(() =>
  (state.value?.tasks ?? []).filter((t) => !t.archived && t.status !== 'cancelled'),
)
const spProgress = computed(() => ({
  done: liveTasks.value.filter((t) => t.status === 'done').reduce((s, t) => s + t.points, 0),
  total: liveTasks.value.reduce((s, t) => s + t.points, 0),
}))
// Worklog != scope: logs can exceed a task's estimate (overrun) or sit on
// unfinished tasks. Decompose the sprint-window worklog so the card explains
// its own gap against "Scope selesai" instead of looking contradictory.
const wlBreakdown = computed(() => {
  const byTask = new Map<number, number>()
  for (const w of state.value?.worklog ?? []) byTask.set(w.task_id, (byTask.get(w.task_id) ?? 0) + w.points)
  const tasks = new Map((state.value?.tasks ?? []).map((t) => [t.id, t]))
  let scope = 0, overrun = 0, inflight = 0, other = 0
  for (const [tid, logged] of byTask) {
    const t = tasks.get(tid)
    if (!t || t.archived || t.status === 'cancelled') other += logged
    else if (t.status === 'done') { const w = Math.min(logged, t.points); scope += w; overrun += logged - w }
    else inflight += logged
  }
  const days = Math.round(((state.value?.sprint.spentSprint ?? 0) / spDay.value) * 10) / 10
  return { scope, overrun, inflight, other, days }
})
// One conversion for the whole section: hari kerja TIM NORMAL. spPerDay is a
// setting (default 2 SP/hari, ~20 SP per sprint 2 minggu) -- deliberately NOT
// the dev's own logging pace, otherwise "hemat" measures nothing.
const spDay = computed(() => Math.max(0.5, state.value?.sprint.spPerDay ?? 2))
const round1 = (n: number) => Math.round(n * 10) / 10
function toDays(sp: number): number {
  return round1(sp / spDay.value)
}
// Hemat = hari kerja tim normal untuk scope yang selesai sejak baseline,
// dikurangi hari kalender yang terpakai. done_at is an ISO stamp, so the
// lexicographic compare against the YYYY-MM-DD cutoff is exact. Fallback
// mirrors the server default (static bake can outlive the API field).
const daysSaved = computed(() => {
  const since = state.value?.sprint.savingsSince || '2026-07-20'
  const done = liveTasks.value.filter((t) => t.status === 'done' && t.done_at !== null && t.done_at >= since)
  const est = done.reduce((s, t) => s + t.points, 0)
  const planned = round1(est / spDay.value)
  const elapsed = Math.max(0, Math.round((Date.now() - new Date(since + 'T00:00:00Z').getTime()) / 86400000))
  return { since, est, count: done.length, planned, elapsed, saved: round1(planned - elapsed) }
})
// Sisa scope + proyeksi: pace dev nyata = scope selesai sejak baseline per
// hari berjalan; ETA sisa dari pace itu.
const remaining = computed(() => {
  const sp = Math.max(0, spProgress.value.total - spProgress.value.done)
  const pace = daysSaved.value.elapsed > 0 ? daysSaved.value.est / daysSaved.value.elapsed : 0
  return { sp, days: toDays(sp), pace: round1(pace), eta: pace > 0 ? round1(sp / pace) : 0 }
})
const daysToTrial = computed(() => {
  const end = state.value?.sprint.end || '2026-07-27'
  return Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86400000))
})

// Options for the searchable selects (LunarSelect) - "semua selectable" cari.
const TASK_TYPE_OPTS = [
  { value: 'task', label: 'task' },
  { value: 'bugfix', label: 'bugfix' },
]
const TASK_STATUS_OPTS = ['todo', 'doing', 'waiting-feedback', 'done', 'cancelled'].map((v) => ({ value: v, label: v }))
const SEVERITY_OPTS = ['critical', 'major', 'minor', 'note'].map((v) => ({ value: v, label: v }))
const FB_STATUS_OPTS = ['open', 'ack', 'resolved'].map((v) => ({ value: v, label: v }))
// Roadmap card picker (utama): code + judul searchable.
const featureOptions = computed(
  () => state.value?.features.map((f) => ({ value: f.id, label: `${f.code} - ${f.title}` })) ?? [],
)

function pct(n: number, of: number): string {
  return of > 0 ? Math.min(100, Math.round((n / of) * 100)) + '%' : '0%'
}
// Pixel heights: % heights collapse inside an auto grid track. 0 SP = no bar.
const BURN_MAX_PX = 44
function burnHeight(points: number): string {
  if (points <= 0) return '0px'
  const max = Math.max(1, ...(state.value?.sprint.burn7.map((b) => b.points) ?? [1]))
  return Math.max(4, Math.round((points / max) * BURN_MAX_PX)) + 'px'
}
function fmtDate(s: string): string {
  if (!s) return ''
  const d = new Date(s.includes('T') || s.includes('Z') ? s : s + 'Z')
  return Number.isNaN(d.getTime())
    ? s
    : d.toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
function isOverdue(t: Task): boolean {
  return !!t.due && t.status !== 'done' && t.status !== 'cancelled' && t.due < new Date().toISOString().slice(0, 10)
}
function featureCode(id: number | null): string {
  return state.value?.features.find((f) => f.id === id)?.code ?? '?'
}
function subtasksFor(featureId: number): Subtask[] {
  return state.value?.subtasks.filter((s) => s.feature_id === featureId) ?? []
}

async function refresh() {
  state.value = await $fetch<LunarState>(`${API}/api/lunar/state`)
  if (openFeature.value) {
    openFeature.value = state.value.features.find((f) => f.id === openFeature.value?.id) ?? null
  }
}

async function mutate(fn: () => Promise<unknown>) {
  busy.value = true
  try {
    await fn()
    await refresh()
  } catch (err) {
    const e = err as { statusCode?: number; statusMessage?: string; message?: string }
    if (e.statusCode === 401) {
      me.value = null
      token.value = ''
      localStorage.removeItem(AUTH_KEY)
    }
    alert(e.statusMessage || e.message || 'Request gagal')
  } finally {
    busy.value = false
  }
}

// Multi-file attachment helpers. Column value is either a legacy single path
// or a JSON array (mirrors server parseAttachments).
function attList(raw: string): string[] {
  if (!raw) return []
  if (raw.startsWith('[')) {
    try {
      const arr: unknown = JSON.parse(raw)
      return Array.isArray(arr) ? arr.filter((p): p is string => typeof p === 'string') : []
    } catch {
      return []
    }
  }
  return [raw]
}
function isImg(path: string): boolean {
  return /\.(png|jpg|webp|gif)$/.test(path)
}
function attLabel(path: string, i: number): string {
  if (path.endsWith('.pdf')) return `PDF ${i + 1}`
  if (/\.(mp4|webm)$/.test(path)) return `video ${i + 1}`
  return `file ${i + 1}`
}

// Uploads every selected file (one multipart request); returns upload paths.
async function uploadFrom(input: HTMLInputElement | null): Promise<string[]> {
  const files = Array.from(input?.files ?? [])
  if (!files.length) return []
  const form = new FormData()
  for (const file of files) form.append('file', file)
  const r = await $fetch<{ files: Array<{ path: string }> }>(`${API}/api/lunar/upload`, {
    method: 'POST',
    body: form,
    headers: authHeaders(),
  })
  if (input) input.value = ''
  return r.files.map((f) => f.path)
}

const handover = (holder: string) =>
  mutate(async () => {
    await $fetch(`${API}/api/lunar/handover`, {
      method: 'POST',
      body: { holder, note: handoverNote.value },
      headers: authHeaders(),
    })
    handoverNote.value = ''
  })

const addTask = () =>
  mutate(async () => {
    await $fetch(`${API}/api/lunar/tasks`, { method: 'POST', body: { ...newTask }, headers: authHeaders() })
    newTask.title = ''
    newTask.detail = ''
    newTask.points = 1
  })

const setTaskStatus = (t: Task, status: string) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/tasks/${t.id}`, { method: 'PATCH', body: { status }, headers: authHeaders() }),
  )

const setTaskDue = (t: Task, due: string) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/tasks/${t.id}`, { method: 'PATCH', body: { due }, headers: authHeaders() }),
  )

// Tabs: aktif (telat dulu, lalu deadline terdekat), selesai (terbaru dulu),
// arsip (soft-deleted + cancelled). Satu list panjang = scroll fatigue.
const taskGroups = computed(() => {
  const all = state.value?.tasks ?? []
  const aktif = all
    .filter((t) => !t.archived && t.status !== 'done' && t.status !== 'cancelled')
    .sort((a, b) => {
      const oa = isOverdue(a) ? 0 : 1
      const ob = isOverdue(b) ? 0 : 1
      if (oa !== ob) return oa - ob
      const da = a.due || '9999'
      const db = b.due || '9999'
      if (da !== db) return da < db ? -1 : 1
      return a.updated_at < b.updated_at ? 1 : -1
    })
  const selesai = all
    .filter((t) => !t.archived && t.status === 'done')
    .sort((a, b) => ((a.done_at ?? '') < (b.done_at ?? '') ? 1 : -1))
  const arsip = all.filter((t) => t.archived || t.status === 'cancelled')
  return { aktif, selesai, arsip }
})
const visibleTasks = computed(() => taskGroups.value[taskTab.value])
// Arsip leaves the ratio: progress is over live work only.
const taskProgress = computed(() => ({
  done: taskGroups.value.selesai.length,
  total: taskGroups.value.aktif.length + taskGroups.value.selesai.length,
}))

function startEditTask(t: Task) {
  editTaskId.value = t.id
  Object.assign(editDraft, { title: t.title, detail: t.detail, area: t.area, points: t.points, due: t.due })
}
const saveEditTask = (t: Task) =>
  mutate(async () => {
    await $fetch(`${API}/api/lunar/tasks/${t.id}`, { method: 'PATCH', body: { ...editDraft }, headers: authHeaders() })
    editTaskId.value = null
  })
const archiveTask = (t: Task, archived: boolean) =>
  mutate(async () => {
    if (archived && !confirm(`Hapus (arsip) task "${t.title}"? Bisa dipulihkan dari tab Arsip.`)) return
    await $fetch(`${API}/api/lunar/tasks/${t.id}`, { method: 'PATCH', body: { archived }, headers: authHeaders() })
  })

// Feedback: tabs (open/ack | resolved | arsip) + inline edit incl. files.
const fbGroups = computed(() => {
  const all = state.value?.feedback ?? []
  return {
    aktif: all.filter((f) => !f.archived && f.status !== 'resolved'),
    resolved: all.filter((f) => !f.archived && f.status === 'resolved'),
    arsip: all.filter((f) => f.archived),
  }
})
const visibleFeedback = computed(() => fbGroups.value[fbTab.value])
const fbProgress = computed(() => ({
  done: fbGroups.value.resolved.length,
  total: fbGroups.value.aktif.length + fbGroups.value.resolved.length,
}))
function startEditFb(f: Feedback) {
  editFbId.value = f.id
  Object.assign(editFbDraft, { body: f.body, link: f.link, attachments: attList(f.attachment) })
}
const saveEditFb = (f: Feedback) =>
  mutate(async () => {
    const added = await uploadFrom(editFbFile.value)
    await $fetch(`${API}/api/lunar/feedback/${f.id}`, {
      method: 'PATCH',
      body: { body: editFbDraft.body, link: editFbDraft.link, attachments: [...editFbDraft.attachments, ...added] },
      headers: authHeaders(),
    })
    editFbId.value = null
  })
const archiveFeedback = (f: Feedback, archived: boolean) =>
  mutate(async () => {
    if (archived && !confirm('Hapus (arsip) feedback ini? Bisa dipulihkan.')) return
    await $fetch(`${API}/api/lunar/feedback/${f.id}`, { method: 'PATCH', body: { archived }, headers: authHeaders() })
  })

// Questions: tabs (open | answered | arsip) + inline edit incl. files.
const qGroups = computed(() => {
  const all = state.value?.questions ?? []
  return {
    open: all.filter((q) => !q.archived && q.status !== 'answered'),
    answered: all.filter((q) => !q.archived && q.status === 'answered'),
    arsip: all.filter((q) => q.archived),
  }
})
const visibleQuestions = computed(() => qGroups.value[qTab.value])
function startEditQ(q: Question) {
  editQId.value = q.id
  editQDraft.question = q.question
  editQDraft.attachments = attList(q.attachment)
}
const saveEditQ = (q: Question) =>
  mutate(async () => {
    const added = await uploadFrom(editQFile.value)
    await $fetch(`${API}/api/lunar/questions/${q.id}`, {
      method: 'PATCH',
      body: { question: editQDraft.question, attachments: [...editQDraft.attachments, ...added] },
      headers: authHeaders(),
    })
    editQId.value = null
  })
const archiveQuestion = (q: Question, archived: boolean) =>
  mutate(async () => {
    if (archived && !confirm('Hapus (arsip) pertanyaan ini? Bisa dipulihkan.')) return
    await $fetch(`${API}/api/lunar/questions/${q.id}`, { method: 'PATCH', body: { archived }, headers: authHeaders() })
  })

const flipTaskBall = (t: Task) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/tasks/${t.id}`, {
      method: 'PATCH',
      body: { ball: t.ball === 'dev' ? 'product' : 'dev' },
      headers: authHeaders(),
    }),
  )

const logWork = (t: Task) =>
  mutate(async () => {
    const points = Number(logDraft[t.id])
    if (!points || points <= 0) return
    await $fetch(`${API}/api/lunar/tasks/${t.id}/worklog`, {
      method: 'POST',
      body: { points },
      headers: authHeaders(),
    })
    logDraft[t.id] = 0
  })

const addFeedback = () =>
  mutate(async () => {
    if (!newFb.featureId) throw createError({ statusMessage: 'Pilih roadmap card dulu' })
    const attachments = await uploadFrom(fbFile.value)
    await $fetch(`${API}/api/lunar/feedback`, {
      method: 'POST',
      body: { ...newFb, attachments },
      headers: authHeaders(),
    })
    newFb.body = ''
    newFb.link = ''
  })

const setFeedbackStatus = (f: Feedback, status: string) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/feedback/${f.id}`, { method: 'PATCH', body: { status }, headers: authHeaders() }),
  )

const addQuestion = () =>
  mutate(async () => {
    if (!newQ.featureId) throw createError({ statusMessage: 'Pilih roadmap card dulu' })
    const attachments = await uploadFrom(qFile.value)
    await $fetch(`${API}/api/lunar/questions`, {
      method: 'POST',
      body: { ...newQ, attachments },
      headers: authHeaders(),
    })
    newQ.question = ''
  })

const answerQuestion = (q: Question) =>
  mutate(async () => {
    const answer = (answerDraft[q.id] || '').trim()
    if (!answer) return
    await $fetch(`${API}/api/lunar/questions/${q.id}`, {
      method: 'PATCH',
      body: { answer },
      headers: authHeaders(),
    })
    answerDraft[q.id] = ''
  })

const addSubtask = () =>
  mutate(async () => {
    if (!openFeature.value || !newSub.title.trim()) return
    await $fetch(`${API}/api/lunar/subtasks`, {
      method: 'POST',
      body: { featureId: openFeature.value.id, title: newSub.title, issueRef: newSub.issueRef },
      headers: authHeaders(),
    })
    newSub.title = ''
    newSub.issueRef = ''
  })

const SUB_CYCLE = ['todo', 'doing', 'done']
const cycleSubtask = (s: Subtask) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/subtasks/${s.id}`, {
      method: 'PATCH',
      body: { status: SUB_CYCLE[(SUB_CYCLE.indexOf(s.status) + 1) % SUB_CYCLE.length] },
      headers: authHeaders(),
    }),
  )

const FEATURE_CYCLE = ['planned', 'building', 'testing', 'done']
const cycleFeatureStatus = (f: Feature) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/features/${f.id}`, {
      method: 'PATCH',
      body: { status: FEATURE_CYCLE[(FEATURE_CYCLE.indexOf(f.status) + 1) % FEATURE_CYCLE.length] },
      headers: authHeaders(),
    }),
  )

const flipFeatureBall = (f: Feature) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/features/${f.id}`, {
      method: 'PATCH',
      body: { ball: f.ball === 'product' ? 'dev' : 'product' },
      headers: authHeaders(),
    }),
  )

const bumpFeature = (f: Feature, delta: number) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/features/${f.id}`, {
      method: 'PATCH',
      body: { issuesDone: f.issues_done + delta },
      headers: authHeaders(),
    }),
  )

const removeFeature = (f: Feature) =>
  mutate(async () => {
    if (!confirm(`Hapus target "${f.code} - ${f.title}" dari board?`)) return
    await $fetch(`${API}/api/lunar/features/${f.id}`, { method: 'DELETE', headers: authHeaders() })
  })

const saveSpPerDay = (v: string) =>
  mutate(() =>
    $fetch(`${API}/api/lunar/settings`, {
      method: 'PATCH',
      body: { spPerDay: Number(v) },
      headers: authHeaders(),
    }),
  )

const syncGithub = () =>
  mutate(async () => {
    syncMsg.value = ''
    try {
      const r = await $fetch<{ synced: { commits: number; issues: number } }>(`${API}/api/lunar/sync-github`, {
        method: 'POST',
        headers: authHeaders(),
      })
      syncMsg.value = `Synced ${r.synced.commits} commits + ${r.synced.issues} issues dari turnkey-devs/lunar-crm-project`
    } catch (err) {
      syncMsg.value = err instanceof Error ? err.message : 'Sync gagal'
    }
  })

onMounted(() => {
  refresh()
  restoreAuth()
})
</script>

<style scoped>
/* Hallmark-inspired: component-scope dashboard - genre: atmospheric (lunar mission control)
 * display: Unbounded - body: IBM Plex Sans - mono: IBM Plex Mono
 * paper: deep space navy - accent: moon amber (product) / signal cyan (dev) */
.lunar-root {
  --paper: oklch(16% 0.03 265);
  --paper-2: oklch(20% 0.035 265);
  --surface: oklch(24% 0.04 265);
  --line: oklch(34% 0.03 265);
  --ink: oklch(93% 0.01 90);
  --muted: oklch(70% 0.02 265);
  --accent: oklch(82% 0.13 85);      /* moon amber */
  --accent-2: oklch(80% 0.11 195);   /* signal cyan */
  --danger: oklch(68% 0.19 25);
  --ok: oklch(75% 0.14 150);
  --font-display: 'Unbounded', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 90rem 40rem at 80% -10%, oklch(26% 0.06 290 / 0.55), transparent),
    radial-gradient(ellipse 60rem 30rem at 0% 110%, oklch(24% 0.05 210 / 0.4), transparent),
    var(--paper);
  color: var(--ink);
  font: 15px/1.6 var(--font-body);
  overflow-x: clip;
}
.stars {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
  background-image:
    radial-gradient(1px 1px at 12% 22%, #fff 100%, transparent),
    radial-gradient(1px 1px at 34% 8%, #fff9 100%, transparent),
    radial-gradient(1.5px 1.5px at 56% 31%, #fffc 100%, transparent),
    radial-gradient(1px 1px at 71% 12%, #fff8 100%, transparent),
    radial-gradient(1px 1px at 88% 42%, #fffa 100%, transparent),
    radial-gradient(1.5px 1.5px at 22% 64%, #fff7 100%, transparent),
    radial-gradient(1px 1px at 63% 78%, #fff9 100%, transparent),
    radial-gradient(1px 1px at 92% 86%, #fff6 100%, transparent);
}
main, .masthead { position: relative; max-width: 72rem; margin: 0 auto; padding: 0 1.25rem; }
main { padding-bottom: 5rem; }
section { margin-top: 3.5rem; }

/* masthead */
.masthead { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; padding-top: 2.5rem; flex-wrap: wrap; }
.mast-left { display: flex; gap: 1rem; align-items: flex-start; }
.sigil { font: 300 2.2rem var(--font-mono); color: var(--accent); letter-spacing: -0.2em; margin-top: 0.4rem; }
.eyebrow { margin: 0; color: var(--muted); font: 600 0.66rem var(--font-mono); letter-spacing: 0.18em; text-transform: uppercase; }
h1 { margin: 0.15rem 0 0; font: 700 clamp(1.9rem, 5vw, 3rem)/1 var(--font-display); letter-spacing: 0.02em; }
h1 .thin { font-weight: 300; color: var(--accent); }
.sub { margin: 0.4rem 0 0; color: var(--muted); }
.countdown { display: flex; align-items: center; gap: 0.7rem; border: 1px solid var(--line); border-radius: 0.9rem; padding: 0.7rem 1rem; background: var(--paper-2); }
.cd-num { font: 700 2.4rem/1 var(--font-display); color: var(--accent); }
.cd-label { color: var(--muted); font: 600 0.64rem var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; }

/* headings */
h2 { margin: 0; font: 500 1.35rem var(--font-display); letter-spacing: 0.01em; }
h3.grp { margin: 2rem 0 0.8rem; color: var(--muted); font: 600 0.7rem var(--font-mono); letter-spacing: 0.16em; text-transform: uppercase; }
.sec-head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.dim { color: var(--muted); }
.small { font-size: 0.8rem; }
.mono { font-family: var(--font-mono); }
.empty { padding: 1rem 0; }

/* ball court */
.ball-court { border: 1px solid var(--line); border-radius: 1.2rem; background: linear-gradient(180deg, var(--paper-2), var(--paper)); padding: 1.6rem; }
.court { position: relative; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; min-height: 9.5rem; }
.court-side { position: relative; z-index: 1; display: grid; gap: 0.2rem; justify-items: start; padding: 0 1rem; opacity: 0.45; transition: opacity 0.4s; }
.court-side.right { justify-items: end; text-align: right; }
.court-side.active { opacity: 1; }
.court-tag { font: 700 0.72rem var(--font-mono); letter-spacing: 0.2em; color: var(--accent-2); }
.court-side.right .court-tag { color: var(--accent); }
.court-name { font: 500 1.1rem var(--font-display); }
.net { width: 1px; align-self: stretch; background: repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 12px); }
.orb-lane { position: absolute; inset: 0; display: flex; align-items: center; pointer-events: none; }
.orb {
  position: relative; width: 5.2rem; height: 5.2rem; border-radius: 50%;
  margin-left: 24%;
  background:
    radial-gradient(circle at 32% 30%, oklch(97% 0.02 90), oklch(80% 0.06 85) 45%, oklch(48% 0.05 80) 75%, oklch(30% 0.04 270) 100%);
  box-shadow: 0 0 3.5rem oklch(82% 0.13 85 / 0.35), inset -0.6rem -0.8rem 1.6rem oklch(20% 0.03 270 / 0.8);
  transition: margin-left 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.court.at-product .orb { margin-left: calc(76% - 5.2rem); }
.orb-ring { position: absolute; inset: -0.85rem; border: 1px solid oklch(82% 0.13 85 / 0.35); border-radius: 50%; animation: spin 14s linear infinite; }
.orb-ring::before { content: ''; position: absolute; top: -3px; left: 50%; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .orb-ring { animation: none; } .orb { transition: none; } }
.ball-meta { border-top: 1px solid var(--line); margin-top: 1rem; padding-top: 1rem; }
.ball-line { margin: 0; font-size: 1.05rem; }
.ball-line strong { color: var(--accent); font-family: var(--font-display); font-weight: 500; }
.ball-note { margin: 0.3rem 0 0; color: var(--muted); font-style: italic; }
.ball-actions { display: flex; gap: 0.6rem; margin-top: 0.9rem; flex-wrap: wrap; }

/* stats */
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: 0.9rem; }
.stat { border: 1px solid var(--line); border-radius: 1rem; background: var(--paper-2); padding: 1rem 1.1rem; display: grid; gap: 0.35rem; align-content: start; }
.stat-num { font: 500 2rem/1 var(--font-display); }
.stat-num .of { color: var(--muted); font-size: 1.1rem; }
.stat-num.under { color: var(--ok); }
.stat-num.over { color: var(--danger); }
.stat-label { color: var(--muted); font: 600 0.66rem var(--font-mono); letter-spacing: 0.13em; text-transform: uppercase; }
.maxday { display: flex; align-items: center; gap: 0.4rem; }

/* bars */
.bar { height: 6px; border-radius: 999px; background: oklch(30% 0.03 265); overflow: hidden; }
.bar.big { height: 10px; margin-bottom: 0.5rem; }
.bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--accent-2), var(--accent)); transition: width 0.6s ease-out; }
.bar-fill.alt { background: var(--ok); }

/* coverage */
.cov-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 0.8rem; }
/* Milestone cards carry more controls (bola, detail, +/-, status, x): wider
 * columns + wrapping rows so nothing spills past the card border. */
.cov-grid.milestones { grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr)); }
.cov-card { border: 1px solid var(--line); border-radius: 0.9rem; background: var(--paper-2); padding: 0.85rem 0.95rem; display: grid; gap: 0.5rem; align-content: start; }
.cov-card[data-status='done'] { border-color: oklch(75% 0.14 150 / 0.5); }
.cov-card header { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
.cov-code { font: 600 0.78rem var(--font-mono); color: var(--accent-2); letter-spacing: 0.08em; }
.cov-count { font: 600 0.78rem var(--font-mono); color: var(--muted); white-space: nowrap; }
.cov-title { margin: 0; font-size: 0.86rem; line-height: 1.35; }
.cov-edit { display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap; row-gap: 0.35rem; }

/* chips + buttons */
.chip { border: 1px solid var(--line); border-radius: 999px; background: transparent; color: var(--muted); font: 600 0.66rem var(--font-mono); letter-spacing: 0.08em; padding: 0.2rem 0.6rem; cursor: pointer; }
.chip[data-status='done'] { color: var(--ok); border-color: currentColor; }
.chip[data-status='testing'] { color: var(--accent); border-color: currentColor; }
.chip[data-status='building'] { color: var(--accent-2); border-color: currentColor; }
.chip.ball-chip[data-ball='dev'] { color: var(--accent-2); border-color: currentColor; }
.chip.ball-chip[data-ball='product'] { color: var(--accent); border-color: currentColor; }
.chip.sev[data-sev='critical'] { color: var(--danger); border-color: currentColor; }
.chip.sev[data-sev='major'] { color: var(--accent); border-color: currentColor; }
.chip.sev[data-sev='minor'] { color: var(--accent-2); border-color: currentColor; }
.mini { width: 1.5rem; height: 1.5rem; border: 1px solid var(--line); border-radius: 0.4rem; background: transparent; color: var(--ink); cursor: pointer; font: 600 0.8rem var(--font-mono); }
.mini:hover, .chip:hover { border-color: var(--accent); color: var(--accent); }
.mini.del:hover { border-color: var(--danger); color: var(--danger); }
.btn {
  border: 1px solid var(--accent); border-radius: 0.6rem; background: oklch(82% 0.13 85 / 0.1);
  color: var(--accent); font: 600 0.82rem var(--font-body); padding: 0.5rem 1rem; cursor: pointer;
  transition: transform 0.15s, background 0.15s;
}
.btn:hover { background: oklch(82% 0.13 85 / 0.2); }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: 0.5; cursor: wait; }
.btn.ghost { border-color: var(--line); background: transparent; color: var(--muted); }
.btn.ghost:hover { color: var(--accent-2); border-color: var(--accent-2); }
:is(.btn, .chip, .mini, .inp):focus-visible { outline: 2px solid var(--accent-2); outline-offset: 2px; }

/* inputs */
.inp {
  border: 1px solid var(--line); border-radius: 0.6rem; background: var(--paper);
  color: var(--ink); font: 400 0.85rem var(--font-body); padding: 0.45rem 0.7rem;
}
.inp::placeholder { color: oklch(52% 0.02 265); }
.inp.grow { flex: 1 1 14rem; min-width: 0; }
.inp.tiny { width: 4rem; }
.inp.w8 { width: 9rem; }
.inp.area { width: 100%; margin-top: 0.5rem; resize: vertical; }
.featsel { min-width: 14rem; }
.w8sel { min-width: 7rem; }
.w10sel { min-width: 9.5rem; }
select.inp { cursor: pointer; }

/* tasks */
.add-form { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
.task-list, .fb-list { list-style: none; margin: 1.2rem 0 0; padding: 0; display: grid; gap: 0.6rem; }
.task, .fb { display: flex; justify-content: space-between; gap: 1rem; border: 1px solid var(--line); border-radius: 0.9rem; background: var(--paper-2); padding: 0.8rem 1rem; flex-wrap: wrap; }
.task[data-status='done'] { opacity: 0.55; }
.task[data-status='cancelled'] { opacity: 0.4; }
.task[data-status='cancelled'] .task-title { text-decoration: line-through; }
.ok-text { color: var(--ok); }
.overdue { color: var(--danger); font-weight: 600; }
.inp.date { width: 8.6rem; font-size: 0.75rem; }
.task[data-status='waiting-feedback'] { border-color: oklch(82% 0.13 85 / 0.5); }
.task-main { display: flex; gap: 0.7rem; min-width: 0; flex: 1 1 20rem; }
.task-title { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
.task-ctrl { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.sp { font: 600 0.78rem var(--font-mono); color: var(--accent); white-space: nowrap; }
.type-tag { align-self: flex-start; border-radius: 0.4rem; padding: 0.15rem 0.45rem; font: 700 0.62rem var(--font-mono); letter-spacing: 0.1em; }
.type-tag[data-type='bugfix'], .type-tag[data-type='issue'] { background: oklch(68% 0.19 25 / 0.16); color: var(--danger); }
.type-tag[data-type='task'], .type-tag[data-type='commit'] { background: oklch(80% 0.11 195 / 0.14); color: var(--accent-2); }

/* feedback */
.fb { align-items: flex-start; }
.fb[data-status='resolved'] { opacity: 0.55; }
.fb-body { flex: 1 1 18rem; min-width: 0; }
.fb-body p { margin: 0; overflow-wrap: anywhere; }

/* activity table */
.act-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.act-table th { text-align: left; color: var(--muted); font: 600 0.66rem var(--font-mono); letter-spacing: 0.13em; text-transform: uppercase; padding: 0.5rem 0.6rem; border-bottom: 1px solid var(--line); }
.act-table td { padding: 0.55rem 0.6rem; border-bottom: 1px solid oklch(28% 0.03 265); vertical-align: top; }
.act-table a { color: var(--accent-2); text-underline-offset: 3px; }
.sec-actions { display: flex; gap: 0.5rem; }

/* loading */
.loading { display: grid; place-items: center; gap: 1rem; min-height: 60vh; }
.small-orb { width: 3.4rem; height: 3.4rem; margin-left: 0; }

.foot { margin-top: 4rem; border-top: 1px solid var(--line); padding-top: 1rem; }

@media (max-width: 640px) {
  .court { grid-template-columns: 1fr; min-height: 13rem; gap: 0.5rem; }
  .net { display: none; }
  .court-side.right { justify-items: start; text-align: left; }
  .orb-lane { align-items: flex-end; padding-bottom: 0.5rem; }
  .task-ctrl { width: 100%; justify-content: flex-end; }
}

/* auth */
.mast-right { display: grid; gap: 0.5rem; justify-items: end; }
.auth-box { display: grid; gap: 0.3rem; justify-items: end; }
.auth-form { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.err { color: var(--danger); }

/* burn chart */
.stat.burn { grid-column: span 2; }
.burn-bars { display: flex; gap: 0.45rem; align-items: flex-end; height: 3.4rem; }
.burn-col { flex: 1; display: grid; grid-template-rows: 1fr auto; gap: 0.2rem; justify-items: center; height: 100%; }
.burn-bar { width: 100%; max-width: 1.6rem; border-radius: 0.25rem 0.25rem 0 0; background: linear-gradient(180deg, var(--accent), var(--accent-2)); align-self: end; }
.burn-day { font: 600 0.6rem var(--font-mono); color: var(--muted); }

/* feedback attachments + questions */
.fb-img { max-width: 14rem; max-height: 9rem; border: 1px solid var(--line); border-radius: 0.5rem; margin-top: 0.4rem; display: block; }
.att-gallery { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.q-answer { margin-top: 0.4rem !important; border-left: 2px solid var(--ok); padding-left: 0.6rem; color: var(--ink); }
.inp.file { max-width: 13rem; font-size: 0.72rem; }
.chip:disabled { cursor: default; opacity: 0.7; }

/* roadmap card modal */
.modal-back { position: fixed; inset: 0; z-index: 30; background: oklch(10% 0.02 265 / 0.75); backdrop-filter: blur(4px); display: grid; place-items: center; padding: 1rem; }
.modal { width: min(38rem, 100%); max-height: 85vh; overflow: auto; border: 1px solid var(--line); border-radius: 1rem; background: var(--paper-2); padding: 1.2rem 1.3rem; }
.modal-head { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; margin-bottom: 0.9rem; }
.modal-head h2 { font-size: 1.1rem; margin-top: 0.2rem; }
.sub-list { list-style: none; margin: 0 0 1rem; padding: 0; display: grid; gap: 0.45rem; }
.sub { display: flex; gap: 0.6rem; align-items: center; border: 1px solid var(--line); border-radius: 0.6rem; padding: 0.45rem 0.6rem; }
.sub-title { flex: 1; font-size: 0.85rem; overflow-wrap: anywhere; }
.sub a { color: var(--accent-2); }

/* tasks UX: tabs, labeled controls, badges, clamp, inline edit */
.tabs { display: flex; gap: 0.4rem; margin: 1.4rem 0 1rem; border-bottom: 1px solid var(--line); padding-bottom: 0.6rem; }
.tab {
  border: 1px solid var(--line); border-radius: 999px; background: transparent;
  color: var(--muted); font: 600 0.78rem var(--font-mono); letter-spacing: 0.06em;
  padding: 0.35rem 0.9rem; cursor: pointer;
}
.tab:hover { border-color: var(--accent-2); color: var(--accent-2); }
.tab.on { border-color: var(--accent); color: var(--accent); background: oklch(82% 0.13 85 / 0.1); }

.field { display: grid; gap: 0.25rem; }
.field.grow { flex: 1 1 14rem; min-width: 0; }
.field.grow .inp { width: 100%; }
.field.wide { width: 100%; }
.f-label { color: var(--muted); font: 600 0.6rem var(--font-mono); letter-spacing: 0.14em; text-transform: uppercase; }

.ctl { display: grid; gap: 0.25rem; align-content: start; }
.ctl-label { color: var(--muted); font: 600 0.58rem var(--font-mono); letter-spacing: 0.13em; text-transform: uppercase; }
.ctl-row { display: flex; gap: 0.3rem; align-items: center; }
.task-ctrl { align-items: start; }

.meta-line { margin: 0.45rem 0 0; display: flex; gap: 0.35rem; flex-wrap: wrap; align-items: center; }
.meta-badge {
  border: 1px solid var(--line); border-radius: 0.4rem; padding: 0.12rem 0.5rem;
  color: var(--muted); font: 500 0.7rem var(--font-mono);
}
.meta-badge.date { color: var(--accent-2); border-color: oklch(80% 0.11 195 / 0.4); }
.meta-badge.warn { color: var(--accent); border-color: oklch(82% 0.13 85 / 0.5); }
.meta-badge.bad { color: var(--danger); border-color: currentColor; font-weight: 700; }
.meta-badge.good { color: var(--ok); border-color: currentColor; }

.detail { white-space: pre-line; }
.detail.clamp { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.toggle-link {
  border: 0; background: transparent; color: var(--accent-2); cursor: pointer;
  font: 600 0.75rem var(--font-body); padding: 0.2rem 0; text-decoration: underline; text-underline-offset: 3px;
}
.overdue-card { border-color: oklch(68% 0.19 25 / 0.55); }

.edit-form { display: flex; gap: 0.6rem; flex-wrap: wrap; width: 100%; align-items: end; }
.edit-actions { display: flex; gap: 0.5rem; }

.chip.link-chip { color: var(--accent); border-color: currentColor; text-decoration: none; font-weight: 700; }
.chip.link-chip:hover { background: oklch(82% 0.13 85 / 0.15); }

/* action buttons (edit/hapus/pulihkan) - proper text buttons, not squeezed squares */
.act {
  border: 1px solid var(--line); border-radius: 0.45rem; background: transparent;
  color: var(--muted); font: 600 0.72rem var(--font-mono); letter-spacing: 0.04em;
  padding: 0.28rem 0.6rem; cursor: pointer; white-space: nowrap;
}
.act:hover { border-color: var(--accent-2); color: var(--accent-2); }
.act.danger:hover { border-color: var(--danger); color: var(--danger); }

/* attachment chip with inline remove (edit mode) */
.chip-x {
  border: 0; background: transparent; color: var(--danger); cursor: pointer;
  font: 700 0.7rem var(--font-mono); padding: 0 0 0 0.3rem;
}
.ctl-row.wrap { flex-wrap: wrap; }
</style>
