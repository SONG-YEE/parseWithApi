let pageNo = 1;

fetch(`http://localhost:8080/table?page_no=${pageNo}`)
.then(response => response.json())
.then(data => {
    const result = data[0].result;
    const baseList = result.baseList;
    const optionList = result.optionList;
    
	const totalCount = result.total_count;                                  // 총 상품건수
    const pageNo = result.now_page_no;
    const countMaxPage = result.max_page_no;
    const errCd = result.err_cd;                                            // 에러코드
    
    const PAGE_SIZE = totalCount % countMaxPage === 0 ? (totalCount / countMaxPage) : (Math.floor(totalCount / countMaxPage) + 1); 							// 페이지당 데이터 건수

    //	console.log("페이지 사이즈가 83 나와야됨", PAGE_SIZE);

    //--------페이지네이션 번호와 일치하는 페이지만 불러오기----------//
    renderTable(data, pageNo);
    function renderTable(data, pageNo) {
        const tbody = document.getElementById("tbody");
        tbody.innerHTML = "";

        // pageNo에 맞는 데이터만 필터링하여 rows 배열에 저장
        const rows = data.filter((item) => item.result.now_page_no === pageNo);

        const baseListRows = rows[0].result.baseList;
        const optionListRows = rows[0].result.optionList;

        const dataListRows = optionListRows.map(v => {
            const matchingList = baseListRows.find(v2 => v2.dcls_month == v.dcls_month && v2.fin_co_no == v.fin_co_no && v2.fin_prdt_cd == v.fin_prdt_cd);
            return {...v, matchingList};
        });
        
        // 필터링된 데이터를 테이블에 추가
        dataListRows.forEach((row) => {
            const tr = document.createElement("tr");
            console.log('rows?', rows);
            console.log('row?', row);
            
            tr.innerHTML = `
                            <td>${row.matchingList.kor_co_nm}</td>
                            <td>${row.matchingList.fin_prdt_nm}</td>
                            <td>${row.rsrv_type_nm}</td>
                            <td>${row.save_trm}개월</td>
                            <td>${row.intr_rate}%</td>
                            <td>${( row.intr_rate - (row.intr_rate * 0.154) ).toFixed(2)}%</td>
                            <td>${row.intr_rate2}%</td>
                            <td>${row.matchingList.join_member}</td>
                            <td>${row.intr_rate_type_nm}</td>
                            <td>
                                <button class="btn-details">상세</button>
                                <div class="details-content" style="display: none;">
                                <dl>
                                    <dt>우대 조건</dt>
                                    <dd>${row.matchingList.spcl_cnd}</dd>
                                    <dt>가입 대상</dt>
                                    <dd>${row.matchingList.join_member}</dd>
                                </dl>
                                <dl>
                                    <dt>가입 방법</dt>
                                    <dd>${row.matchingList.join_way}</dd>
                                    <dt>만기 후 이자율</dt>
                                    <dd>${row.matchingList.mtrt_int}</dd>
                                    <dt>기타 유의사항</dt>
                                    <dd>${row.matchingList.etc_note}</dd>
                                </dl>
                                </div>
                            </td>
                            `;
            tbody.appendChild(tr);
        });
    }
    renderPagination(countMaxPage, pageNo);
    function renderPagination(totalPage, pageNo) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

        // 이전 버튼 생성
        const prevButton = document.createElement("li");
        prevButton.innerHTML = `<a class="page-link" href="#" tabindex="-1">◀</a>`;
        if (pageNo === 1) prevButton.classList.add("disabled");
        prevButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (pageNo > 1) {
                pageNo--;
            renderTable(data, pageNo);
            renderPagination(totalPage, pageNo);
            }
        });
        pagination.appendChild(prevButton);

        // 페이지 버튼 생성
        for (let i = 1; i <= totalPage; i++) {
            const pageButton = document.createElement("li");
            pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            if (i === pageNo) pageButton.classList.add("active");
            pageButton.addEventListener("click", (e) => {
            e.preventDefault();
            pageNo = i;
            renderTable(data, pageNo);
            renderPagination(totalPage, pageNo);
            });
            pagination.appendChild(pageButton);
        }

        // 다음 버튼 생성
        const nextButton = document.createElement("li");
        nextButton.innerHTML = `<a class="page-link" href="#">▶</a>`;
        if (pageNo === totalPage) nextButton.classList.add("disabled");
        nextButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (pageNo < totalPage) {
            pageNo++;
        renderTable(data, pageNo);
        renderPagination(totalPage, pageNo);
        }
        });
        pagination.appendChild(nextButton);

        

        //-----------상세정보 버튼---------------//
        const btnDetailsList = document.querySelectorAll('.btn-details');
        //const btnDetails = document.querySelector('.btn-details');
        //const detailsContent = document.querySelector('.details-content');

        btnDetailsList.forEach(btn => {
            btn.addEventListener('click', () => {
                const detailsContent = btn.nextElementSibling;

                if (detailsContent.style.display === 'none') {
                detailsContent.style.display = 'block';
                btn.textContent = '접기';
                } else {
                detailsContent.style.display = 'none';
                btn.textContent = '상세';
                }
            });
        });
      
    }
})
.catch(error => {
    console.error('Error:', error);
});
