// Lucas Bubner, 2022

function pageManage(page) {
	switch (page) {
        case "index":
            window.location.href = "index.html";
            break;
        case "cpu":
			window.location.href = "parts/cpu.html";
			break;
		case "mobo":
			window.location.href = "parts/motherboard.html";
			break;
		case "gpu":
			window.location.href = "parts/graphics.html";
			break;
		case "ram":
			window.location.href = "parts/memory.html";
			break;
		case "psu":
			window.location.href = "parts/powersupply.html";
			break;
		case "cool":
			window.location.href = "parts/cooling.html";
			break;
		case "stor":
			window.location.href = "parts/storage.html";
			break;
		case "case":
			window.location.href = "parts/case.html";
			break;
		default:
			throw Exception("Cannot find file redirection.");
	}
}
