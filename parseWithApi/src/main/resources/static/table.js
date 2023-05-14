let pageNo = 1;
// async function fetchData(pageNo) {

// }
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
    const korCoNmList = []; // 금융회사
    const rsrvTypeNmList = [];
    const finPrdtNm = [];                                                        // 금융상품명 : 상품명
    let rsrvTypeNm; 
    //= optionList.rsrv_rate_type_nm;                        // 금리유형명 : 적립방식

    let saveTrm = optionList.save_trm;                                    // 저축 기간(개월) : 저축 기간(개월)
    let intrRate = optionList.intr_rate;                                  // 저축 금리 : 세전 이자율
    let intrRateAfter = ( intrRate - (intrRate * 0.154) ).toFixed(2);     // 저축 금리 : 세후 이자율
    let intrRate2 = optionList.intr_rate2                                 // 최고 우대금리 : 최고 우대금리
    let intrRateTypeNm = optionList.intr_rate_type_nm                     // 적립유형명 : 이자계산방식

    let spclCnd = result.spcl_cnd;                                        // 우대조건 : 우대조건
    let joinMember = result.join_member;                                  // 가입대상 : 가입대상
    let joinWay = result.join_way;                                        // 가입방법 : 가입방법
    let mtrtInt = result.mtrt_int;                                        // 만기 후 이자율 : 만기 후 이자율
    let etcNote = result.etc_note;                                        // 기타 유의사항 : 기타 유의사항
    
    data.forEach(item => {
        const baseList = item.result.baseList;
        const optionList = item.result.optionList;
        baseList.forEach(baseItem => {
            const korCoNm = baseItem.kor_co_nm; // 금융회사
            
            korCoNmList.push(korCoNm);
        });
        optionList.forEach(optionItem => {
            const rsrvTypeNm = optionItem.rsrv_type_nm;
            
            rsrvTypeNmList.push(rsrvTypeNm); 
        })
    });    

    console.log(':::상품명결과확인:::',korCoNmList);
    console.log(':::적립방식결과확인:::',rsrvTypeNmList);

    // for (let i = 0; i < result.length; i++) {
    //     const value1 = baseList[i];
    //     const value2 = optionList[i];

    //     finPrdtNm = value1["fin_prdt_nm"];
    //     rsrvTypeNm = value2["rsrv_rate_type_nm"];

    //     console.log('상품명출력', finPrdtNm);
    //     console.log('적립방식 출력', rsrvTypeNm);
    // }

    // for (let i = 0; i < baseList.length; i++) {
    //     const key = i;  // 인덱스 값을 기준으로 키를 계산
    //     const value = baseList[i];
    //     console.log(`::::${key}:::::`);
        
    //     finPrdtNm = value["fin_prdt_nm"];
    // }

    //--------페이지네이션 번호와 일치하는 페이지만 불러오기----------//
    function renderTable(data, pageNo) {
        const tbody = document.getElementById("tbody");
        tbody.innerHTML = "";

        // pageNo에 맞는 데이터만 필터링하여 rows 배열에 저장
        const rows = data.filter((item) => item.pageNo === pageNo);
        
        // 필터링된 데이터를 테이블에 추가
        rows.forEach((row) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${row.korCoNm}</td>
            <td>${row.finPrdtNm}</td>
            <td>${row.intrRateTypeNm}</td>
            <td>${row.saveTrm}</td>
            <td>${row.intrRate}%</td>
            <td>${row.intrRate2}%</td>
            <td>${row.maxIntrRate}%</td>
            <td>${row.joinWay}</td>
            <td>${row.interstPayCycle}</td>
            <td>
                <button class="btn-details">상세</button>
                <div class="details-content" style="display: none;">
                <dl>
                    <dt>우대 조건</dt>
                    <dd>${row.spclCnd}</dd>
                    <dt>가입 대상</dt>
                    <dd>${row.joinDeny}</dd>
                </dl>
                <dl>
                    <dt>가입 방법</dt>
                    <dd>${row.joinWay}</dd>
                    <dt>만기 후 이자율</dt>
                    <dd>${row.mtrtInt}</dd>
                    <dt>기타 유의사항</dt>
                    <dd>${row.etcNote}</dd>
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

    renderTable(data, pageNo);




    //-----------상세정보 버튼---------------//
    const btnDetailsList = document.querySelectorAll('.btn-details');
    const btnDetails = document.querySelector('.btn-details');
    const detailsContent = document.querySelector('.details-content');

    btnDetailsList.forEach(btn => {
        btn.addEventListener('click', () => {
            const tr = btn.closest('tr');
            const finPrdtNm = tr.querySelector('td:nth-child(2)').textContent;
            const spclCnd = tr.querySelector('td:nth-child(11) dl:first-child dd').textContent;
            const joinDeny = tr.querySelector('td:nth-child(11) dl:last-child dd').textContent;

            const detailsContent = btn.nextElementSibling;
            const productName = detailsContent.querySelector('dl:first-child dd');
            const spclCndDetail = detailsContent.querySelector('dl:nth-child(2) dd');
            const joinDenyDetail = detailsContent.querySelector('dl:last-child dd');

            productName.textContent = finPrdtNm;
            spclCndDetail.textContent = spclCnd;
            joinDenyDetail.textContent = joinDeny;

            if (detailsContent.style.display === 'none') {
            detailsContent.style.display = 'block';
            btn.textContent = '접기';
            } else {
            detailsContent.style.display = 'none';
            btn.textContent = '상세';
            }
        });
    });
	
    //-------속성명 : 테이블 컬럼명-----------//
	// const korCoNm = baseList.kor_co_nm;                                     // 금융회사명 : 금융회사
    
    // console.log(result);
    // console.log(baseList);
    // console.log(optionList);
    // console.log(totalCount);
    // console.log(nowPageNo);
    // console.log(countMaxPage);
    // console.log("제발 이제는 진짜 다 나와야지 쫌..", korCoNm);			    // ***이게 0번 노드만 나오네..
    // baseList.forEach(item => {
  	// console.log("이거는 다 나와야된다 진짜로 제발", item.kor_co_nm);
	// });


    // baseList.forEach(item => {
    //     console.log('상품명', item.finPrdtNm);
	// });
    // console.log('적립방식', rsrvTypeNm);
    // console.log('저축 기간', saveTrm);
    // console.log('세전 이자율', intrRate);
    // console.log('세후 이자율', intrRateAfter);
    // console.log('최고 우대금리', intrRate2);
    // console.log('이자계산방식', intrRateTypeNm);
    // console.log('우대조건', spclCnd);
    // console.log('가입대상', joinMember);
    // console.log('가입방법', joinWay);
    // console.log('만기 후 이자율', mtrtInt);
    // console.log('기타 유의사항', etcNote);
    //-------table row별 배열-----------//

    }
})
.catch(error => {
    console.error('Error:', error);
});
