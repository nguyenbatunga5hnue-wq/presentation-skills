# presentation-skills

Claude Code skills for building teacher-controlled, interactive lesson slides.

| Skill | Dùng khi |
|---|---|
| `interactive-lesson-deck` | Biến giáo án / bài trong sách thành slides tương tác theo phong cách của tôi: giáo viên điều khiển, hiệu ứng có âm thanh, bảng điểm nhóm (phím B), đồng hồ hoạt động, bản đồ minh hoạ, cảnh 3D theo góc nhìn, ô nhập mô tả đường đi có chấm tự động, slide luyện đề có audio, phụ đề, chọn A/B/C, xuất 1 file HTML offline |
| `ielts-listening-review` | Từ đề IELTS Listening (PDF + audio) làm slides chữa đề: audio từng câu, phụ đề, clue, bẫy, đánh số thứ tự trắc nghiệm, matching 2 vòng, kim tự tháp kỹ năng nghe, bảng điểm nhóm |

## Cài đặt

Skills nằm trong `.claude/skills/`, nên mở repo này làm project trong Claude Code là dùng được ngay.
Để dùng ở mọi project:

```bash
git clone https://github.com/nguyenbatunga5hnue-wq/presentation-skills.git ~/presentation-skills
```

```bash
mkdir -p ~/.claude/skills && cp -r ~/presentation-skills/.claude/skills/* ~/.claude/skills/
```

Cần: Python 3, ffmpeg, poppler-utils (`pdftotext`, `pdfimages`), và để phiên âm audio:
`pip install sherpa-onnx numpy`.

## Ví dụ

- `interactive-lesson-deck/examples/map-labelling/`: giáo án Map Labelling 90 phút (band 3.0).
  Ảnh trang sách và audio không nằm trong repo; đặt chúng vào `media/` khi build.
- `ielts-listening-review/examples/cam19_test3.py`: Cambridge 19, Listening Test 3.
