const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                nickname: true,
                role: true,
                createdAt: true,
            },
        });

        console.log('📋 현재 등록된 사용자 목록:');
        console.log('='.repeat(50));

        if (users.length === 0) {
            console.log('등록된 사용자가 없습니다.');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. ID: ${user.username}`);
                console.log(`   닉네임: ${user.nickname}`);
                console.log(`   권한: ${user.role}`);
                console.log(`   등록일: ${user.createdAt}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ 오류 발생:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers(); 